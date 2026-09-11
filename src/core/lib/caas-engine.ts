// src/core/lib/caas-engine.ts
// Automaton-HSCSG — CaaS Engine (asimilado desde Zeitnus-Firma-Operaciones-Ecotomica)
// Principio anfibio: misma lógica opera en modo 'postmonetario' (ZNU/CaaS) o 'conectado' (USD/USDC via oracle)

import type { JSONSchema, JSONSchemaProperty, CaaSTier } from '../../types.js';

/* ═════════════════════════════════════════════════════════════════
   TIPOS CaaS TIER
   ═════════════════════════════════════════════════════════════════ */

export interface TierConfig {
  toolsPerMonth: number;           // -1 = unlimited
  exports: ExportFormat[];
  ads: boolean;
  apiAccess: boolean;
  whiteLabel?: boolean;
  trustlinesLimit?: bigint;
  znuCost: bigint;                 // ZNU/mes (0 = free)
  frneEmission: bigint;            // FRNE emitido por uso
}

export type ExportFormat = 'png' | 'svg' | '3mf' | 'stl' | 'pdf' | 'json' | 'all';

export interface CaaSUser {
  did: string;                     // did:hsccsg:user:...
  tier: CaaSTier;
  znuBalance: bigint;
  frneEarned: bigint;
  toolsUsedThisMonth: number;
  apiCallsThisMonth: number;
  trustlines: Trustline[];
  createdAt: number;
  lastActiveAt: number;
}

export interface Trustline {
  counterparty: string;            // DID
  creditLimit: bigint;
  debitLimit: bigint;
  balance: bigint;                 // positivo = nos deben, negativo = debemos
  currency: 'ZNU' | 'FRNE' | 'USD';
  active: boolean;
}

export interface CaaSTool {
  id: string;                      // slug único
  name: string;
  description: string;
  tier: CaaSTier;                  // tier mínimo requerido
  category: string;
  tags: string[];
  deploymentUrl: string;           // Vercel Edge Function URL
  schema: ToolSchema;
  metrics: ToolMetrics;
  createdAt: number;
  createdBy: string;               // DID
}

export interface ToolSchema {
  input: JSONSchema;
  output: JSONSchema;
  config: Record<string, any>;
}

export interface ToolMetrics {
  totalRuns: bigint;
  uniqueUsers: bigint;
  avgLatencyMs: number;
  errorRate: number;
  frneGenerated: bigint;
  znuCollected: bigint;
  adRevenueUsd: number;
}

export interface CaaSContribution {
  userDid: string;
  toolId: string;
  action: 'run' | 'export' | 'api_call' | 'create';
  tier: CaaSTier;
  znuCost: bigint;
  frneEmitted: bigint;
  timestamp: number;
  metadata: Record<string, any>;
}

/* ═════════════════════════════════════════════════════════════════
   CONFIGURACIÓN TIER (Economía HSCSG)
   ════════════════════════════════════════════════════════════════ */

export const TIER_CONFIGS: Record<CaaSTier, TierConfig> = {
  FREE: {
    toolsPerMonth: 10,
    exports: ['png', 'svg'],
    ads: true,
    apiAccess: false,
    znuCost: 0n,
    frneEmission: 1n
  },
  PRO: {
    toolsPerMonth: 1000,
    exports: ['png', 'svg', '3mf', 'stl', 'pdf', 'json'],
    ads: false,
    apiAccess: true,
    znuCost: 1000n,        // 1000 ZNU/mes ≈ 19€ (via priceParity oracle)
    frneEmission: 50n
  },
  ENTERPRISE: {
    toolsPerMonth: -1,
    exports: ['all'],
    ads: false,
    apiAccess: true,
    whiteLabel: true,
    trustlinesLimit: 10000n,
    znuCost: 5000n,        // 5000 ZNU/mes ≈ 59€
    frneEmission: 500n
  }
};

/* ═════════════════════════════════════════════════════════════════
   CaaS ENGINE CLASS
   ════════════════════════════════════════════════════════════════ */

export class CaaSEngine {
  private users: Map<string, CaaSUser> = new Map();
  private tools: Map<string, CaaSTool> = new Map();
  private contributions: CaaSContribution[] = [];
  private priceParity: number = 0.019; // 1 ZNU = 0.019 USD (actualizable via oracle)

  constructor() {
    this.loadFromStorage();
  }

  /* ────────────────────────────────────────────────────────────────
     USER MANAGEMENT
     ──────────────────────────────────────────────────────────────── */

  async getOrCreateUser(did: string): Promise<CaaSUser> {
    let user = this.users.get(did);
    if (!user) {
      user = {
        did,
        tier: 'FREE',
        znuBalance: 100n,        // Welcome bonus
        frneEarned: 0n,
        toolsUsedThisMonth: 0,
        apiCallsThisMonth: 0,
        trustlines: [],
        createdAt: Date.now(),
        lastActiveAt: Date.now()
      };
      this.users.set(did, user);
      this.saveToStorage();
    }
    user.lastActiveAt = Date.now();
    return user;
  }

  async upgradeTier(did: string, newTier: CaaSTier): Promise<{ success: boolean; reason?: string }> {
    const user = await this.getOrCreateUser(did);
    const config = TIER_CONFIGS[newTier];
    
    if (user.znuBalance < config.znuCost) {
      return { success: false, reason: `Insufficient ZNU. Required: ${config.znuCost}, Available: ${user.znuBalance}` };
    }

    // Burn ZNU (economía anfibia: ZNU se quema, FRNE se emite)
    user.znuBalance -= config.znuCost;
    user.tier = newTier;
    user.frneEarned += config.frneEmission;
    
    this.recordContribution({
      userDid: did,
      toolId: 'tier-upgrade',
      action: 'create',
      tier: newTier,
      znuCost: config.znuCost,
      frneEmitted: config.frneEmission,
      timestamp: Date.now(),
      metadata: { previousTier: user.tier }
    });

    this.saveToStorage();
    return { success: true };
  }

  /* ────────────────────────────────────────────────────────────────
     ACCESS CONTROL (MJ Gate + Boundaries)
     ──────────────────────────────────────────────────────────────── */

  async verifyAccess(
    did: string,
    toolId: string,
    action: 'run' | 'export' | 'api_call'
  ): Promise<AccessResult> {
    const user = await this.getOrCreateUser(did);
    const tool = this.tools.get(toolId);
    
    if (!tool) {
      return { allowed: false, reason: 'Tool not found', tier: user.tier };
    }

    const userTier = user.tier;
    const requiredTier = tool.tier;
    
    // Jerarquía: ENTERPRISE > PRO > FREE
    const tierHierarchy: Record<CaaSTier, number> = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
    if (tierHierarchy[userTier] < tierHierarchy[requiredTier]) {
      return { 
        allowed: false, 
        reason: `Requires ${requiredTier} tier. Current: ${userTier}`,
        tier: userTier,
        requiredTier
      };
    }

    // Límites mensuales
    if (user.toolsUsedThisMonth >= TIER_CONFIGS[userTier].toolsPerMonth && TIER_CONFIGS[userTier].toolsPerMonth > 0) {
      return { 
        allowed: false, 
        reason: `Monthly limit reached (${TIER_CONFIGS[userTier].toolsPerMonth} tools/month)`,
        tier: userTier
      };
    }

    // API rate limit
    if (action === 'api_call') {
      const limit = TIER_CONFIGS[userTier].apiAccess ? 10000 : 0;
      if (user.apiCallsThisMonth >= limit) {
        return { allowed: false, reason: 'API rate limit exceeded', tier: userTier };
      }
    }

    return { allowed: true, tier: userTier };
  }

  async recordUsage(
    did: string,
    toolId: string,
    action: 'run' | 'export' | 'api_call',
    metadata: Record<string, any> = {}
  ): Promise<CaaSContribution> {
    const user = await this.getOrCreateUser(did);
    const tool = this.tools.get(toolId);
    const config = TIER_CONFIGS[user.tier];
    
    const contribution: CaaSContribution = {
      userDid: did,
      toolId,
      action,
      tier: user.tier,
      znuCost: 0n,           // No ZNU cost per use (solo tier upgrade)
      frneEmitted: config.frneEmission,
      timestamp: Date.now(),
      metadata
    };

    // Actualizar contadores
    if (action === 'run') user.toolsUsedThisMonth++;
    if (action === 'api_call') user.apiCallsThisMonth++;
    user.frneEarned += config.frneEmission;

    // Actualizar métricas tool
    if (tool) {
      tool.metrics.totalRuns += 1n;
      tool.metrics.frneGenerated += config.frneEmission;
    }

    this.contributions.push(contribution);
    this.saveToStorage();
    
    return contribution;
  }

  /* ────────────────────────────────────────────────────────────────
     RECORD CONTRIBUTION (internal helper for tier upgrades, etc.)
     ──────────────────────────────────────────────────────────────── */

  private recordContribution(contribution: CaaSContribution): void {
    this.contributions.push(contribution);
    this.saveToStorage();
  }

  /* ────────────────────────────────────────────────────────────────
     TOOL REGISTRY
     ──────────────────────────────────────────────────────────────── */

  async registerTool(tool: Omit<CaaSTool, 'metrics' | 'createdAt'>): Promise<CaaSTool> {
    const fullTool: CaaSTool = {
      ...tool,
      metrics: {
        totalRuns: 0n,
        uniqueUsers: 0n,
        avgLatencyMs: 0,
        errorRate: 0,
        frneGenerated: 0n,
        znuCollected: 0n,
        adRevenueUsd: 0
      },
      createdAt: Date.now()
    };
    this.tools.set(tool.id, fullTool);
    this.saveToStorage();
    return fullTool;
  }

  getTool(id: string): CaaSTool | undefined {
    return this.tools.get(id);
  }

  listTools(tier?: CaaSTier): CaaSTool[] {
    const all = Array.from(this.tools.values());
    if (!tier) return all;
    const hierarchy: Record<CaaSTier, number> = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
    return all.filter(t => hierarchy[t.tier] <= hierarchy[tier]);
  }

  /* ────────────────────────────────────────────────────────────────
     TRUSTLINES B2B
     ──────────────────────────────────────────────────────────────── */

  async createTrustline(
    did: string,
    counterparty: string,
    creditLimit: bigint,
    debitLimit: bigint,
    currency: 'ZNU' | 'FRNE' | 'USD' = 'ZNU'
  ): Promise<Trustline> {
    const user = await this.getOrCreateUser(did);
    const config = TIER_CONFIGS[user.tier];
    
    if (config.trustlinesLimit && user.trustlines.length >= Number(config.trustlinesLimit)) {
      throw new Error('Trustline limit reached for tier');
    }

    const trustline: Trustline = {
      counterparty,
      creditLimit,
      debitLimit,
      balance: 0n,
      currency,
      active: true
    };
    user.trustlines.push(trustline);
    this.saveToStorage();
    return trustline;
  }

  async settleTrustline(
    did: string,
    counterparty: string,
    amount: bigint
  ): Promise<{ success: boolean; newBalance: bigint }> {
    const user = this.users.get(did);
    if (!user) throw new Error('User not found');
    
    const tl = user.trustlines.find(t => t.counterparty === counterparty && t.active);
    if (!tl) throw new Error('Trustline not found');
    
    const newBalance = tl.balance + amount;
    if (newBalance > tl.creditLimit || newBalance < -tl.debitLimit) {
      return { success: false, newBalance: tl.balance };
    }
    
    tl.balance = newBalance;
    this.saveToStorage();
    return { success: true, newBalance };
  }

  /* ────────────────────────────────────────────────────────────────
     ECONOMÍA: ZNU/FRNE/PRICE PARITY
     ──────────────────────────────────────────────────────────────── */

  getPriceParity(): number { return this.priceParity; }
  
  async updatePriceParity(newRate: number): Promise<void> {
    // Llamado por LoopEngine via oracle externo
    this.priceParity = newRate;
    this.saveToStorage();
  }

  znuToUsd(znu: bigint): number {
    return Number(znu) * this.priceParity;
  }

  usdToZnu(usd: number): bigint {
    return BigInt(Math.floor(usd / this.priceParity));
  }

  getMonthlyRevenueUsd(tier: CaaSTier): number {
    const config = TIER_CONFIGS[tier];
    return this.znuToUsd(config.znuCost);
  }

  getTierConfig(tier: CaaSTier): TierConfig {
    return TIER_CONFIGS[tier];
  }

  /* ────────────────────────────────────────────────────────────────
     LOOPENGINE INTEGRATION (Daily Tick)
     ──────────────────────────────────────────────────────────────── */

  async dailyTick(): Promise<DailyTickResult> {
    let totalFrneEmitted = 0n;
    let totalZnuBurned = 0n;
    let activeUsers = 0;

    // Reset contadores mensuales (si es día 1)
    const now = new Date();
    if (now.getDate() === 1) {
      for (const user of this.users.values()) {
        user.toolsUsedThisMonth = 0;
        user.apiCallsThisMonth = 0;
      }
    }

    // Emitir FRNE por holdings ZNU (staking implícito)
    for (const user of this.users.values()) {
      if (user.znuBalance > 0n) {
        const stakingReward = user.znuBalance / 1000n; // 0.1% diario ≈ 36.5% anual
        user.frneEarned += stakingReward;
        totalFrneEmitted += stakingReward;
        activeUsers++;
      }
    }

    // Price parity update (simulado - en producción via oracle)
    // this.priceParity = await fetchOraclePrice();

    this.saveToStorage();

    return {
      timestamp: Date.now(),
      activeUsers,
      totalFrneEmitted,
      totalZnuBurned,
      priceParity: this.priceParity,
      totalUsers: this.users.size,
      totalTools: this.tools.size
    };
  }

  /* ────────────────────────────────────────────────────────────────
     STORAGE (SQLite via Automaton state layer)
     ──────────────────────────────────────────────────────────────── */

  private saveToStorage(): void {
    const data = {
      users: Array.from(this.users.entries()),
      tools: Array.from(this.tools.entries()),
      contributions: this.contributions.slice(-10000), // Keep last 10k
      priceParity: this.priceParity,
      version: '1.0.0',
      timestamp: Date.now()
    };
    
    // En Automaton: usar state layer SQLite
    // await this.state.set('caas-engine', data);
  }

  private loadFromStorage(): void {
    // En Automaton: cargar desde state layer SQLite
    // const stored = await this.state.get('caas-engine');
  }

  /* ────────────────────────────────────────────────────────────────
     ANALYTICS / EXPORT
     ──────────────────────────────────────────────────────────────── */

  getAnalytics(): CaaSAnalytics {
    const users = Array.from(this.users.values());
    const tools = Array.from(this.tools.values());
    
    return {
      totalUsers: users.length,
      usersByTier: {
        FREE: users.filter(u => u.tier === 'FREE').length,
        PRO: users.filter(u => u.tier === 'PRO').length,
        ENTERPRISE: users.filter(u => u.tier === 'ENTERPRISE').length
      },
      totalTools: tools.length,
      toolsByTier: {
        FREE: tools.filter(t => t.tier === 'FREE').length,
        PRO: tools.filter(t => t.tier === 'PRO').length,
        ENTERPRISE: tools.filter(t => t.tier === 'ENTERPRISE').length
      },
      totalFrneCirculating: users.reduce((sum, u) => sum + u.frneEarned, 0n),
      totalZnuHeld: users.reduce((sum, u) => sum + u.znuBalance, 0n),
      monthlyRecurringUsd: users
        .filter(u => u.tier !== 'FREE')
        .reduce((sum, u) => sum + this.getMonthlyRevenueUsd(u.tier), 0),
      topTools: tools
        .sort((a, b) => Number(b.metrics.totalRuns - a.metrics.totalRuns))
        .slice(0, 10)
        .map(t => ({ id: t.id, runs: t.metrics.totalRuns, frne: t.metrics.frneGenerated }))
    };
  }
}

/* ══════════════════════════════════════════════════════════════════
   TIPOS RESULTADO
   ═════════════════════════════════════════════════════════════════ */

export interface AccessResult {
  allowed: boolean;
  reason?: string;
  tier: CaaSTier;
  requiredTier?: CaaSTier;
}

export interface DailyTickResult {
  timestamp: number;
  activeUsers: number;
  totalFrneEmitted: bigint;
  totalZnuBurned: bigint;
  priceParity: number;
  totalUsers: number;
  totalTools: number;
}

export interface CaaSAnalytics {
  totalUsers: number;
  usersByTier: Record<CaaSTier, number>;
  totalTools: number;
  toolsByTier: Record<CaaSTier, number>;
  totalFrneCirculating: bigint;
  totalZnuHeld: bigint;
  monthlyRecurringUsd: number;
  topTools: Array<{ id: string; runs: bigint; frne: bigint }>;
}

/* ═════════════════════════════════════════════════════════════════
   SINGLETON EXPORT
   ════════════════════════════════════════════════════════════════ */

export const caasEngine = new CaaSEngine();
export default caasEngine;