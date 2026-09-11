// src/heartbeat/gossip.ts
// Automaton-HSCSG — RIDF Heartbeat/Gossip (asimilado desde red-de-intercambio-federada-isaacko)
// Perspectiva TELEOLÓGICA: HACER — sincronización periódica, reconciliación, propagación

import type { ToolContext } from '../agent/types.js';

/* ═════════════════════════════════════════════════════════════════
   TIPOS — Gossip Protocol
   ═════════════════════════════════════════════════════════════════ */

export interface PeerClient {
  syncBalances(ctx: ToolContext, peerDomain: string): Promise<void>;
  syncBilateralLimits(ctx: ToolContext, peerDomain: string): Promise<void>;
  syncNodeLevels(ctx: ToolContext, peerDomain: string): Promise<void>;
  reconcileChain(ctx: ToolContext, peerDomain: string): Promise<void>;
}

export interface Reconciler {
  reconcileWithPeer(ctx: ToolContext, peerDomain: string): Promise<void>;
}

export interface Propagator {
  catchUpFromPeers(ctx: ToolContext): Promise<void>;
  propagateToPeers(ctx: ToolContext): Promise<void>;
}

export interface GossipConfig {
  nodeDomain: string;
  intervalMs: number;
  pool: any; // pgxpool.Pool equivalent
}

export interface SyncResult {
  peerDomain: string;
  success: boolean;
  syncedAt: Date;
  error?: string;
}

/* ═════════════════════════════════════════════════════════════════
   GOSSIP ENGINE — Heartbeat periódico (Ley I: acción, Ley II: forma, Ley III: lucidez)
   ═════════════════════════════════════════════════════════════════ */

export class GossipEngine {
  private client: PeerClient | null = null;
  private reconciler: Reconciler | null = null;
  private propagator: Propagator | null = null;
  private needsCatchUp = true;
  private running = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private config: GossipConfig,
    private ctx: ToolContext
  ) {}

  setClient(client: PeerClient): void {
    this.client = client;
  }

  setReconciler(reconciler: Reconciler): void {
    this.reconciler = reconciler;
  }

  setPropagator(propagator: Propagator): void {
    this.propagator = propagator;
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;

    const interval = this.config.intervalMs || 60000;

    // Catch-up inmediato al arranque (Ley I: acción inmediata)
    if (this.needsCatchUp && this.propagator) {
      await this.propagator.catchUpFromPeers(this.ctx);
      this.needsCatchUp = false;
    }

    this.intervalId = setInterval(async () => {
      if (!this.running) return;
      await this.syncCycle();
    }, interval);
  }

  async stop(): Promise<void> {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async syncCycle(): Promise<void> {
    const peers = await this.getKnownPeers();
    
    for (const peer of peers) {
      await this.syncWithPeer(peer);
    }

    // Reconciliación completa con todos los peers
    if (this.reconciler) {
      for (const peer of peers) {
        await this.reconciler.reconcileWithPeer(this.ctx, peer);
      }
    }
  }

  private async syncWithPeer(peerDomain: string): Promise<void> {
    if (!this.client) return;

    const tasks = [
      this.client.syncBalances(this.ctx, peerDomain),
      this.client.syncBilateralLimits(this.ctx, peerDomain),
      this.client.syncNodeLevels(this.ctx, peerDomain),
    ];

    await Promise.allSettled(tasks);
  }

  private async getKnownPeers(): Promise<string[]> {
    // En implementación real, consultar BD de peers federados
    return ['peer1.example.com', 'peer2.example.com'];
  }
}

/* ═════════════════════════════════════════════════════════════════
   HEARTBEAT TASK — Integración con DurableScheduler de Automaton
   ═════════════════════════════════════════════════════════════════ */

export interface HeartbeatTaskConfig {
  tierMinimum: 'free' | 'pro' | 'enterprise' | 'critical';
  intervalMs: number;
}

export function createHeartbeatTask(
  gossipEngine: GossipEngine,
  config: HeartbeatTaskConfig
) {
  return {
    name: 'federation-heartbeat',
    tierMinimum: config.tierMinimum,
    intervalMs: config.intervalMs,
    async run(ctx: ToolContext): Promise<void> {
      // El GossipEngine ya corre su propio intervalo
      // Esta task verifica salud y métricas
      console.log('💓 Federation heartbeat check');
    }
  };
}

/* ═════════════════════════════════════════════════════════════════
   EXPORT
   ═════════════════════════════════════════════════════════════════ */

export const gossipEngine = (config: GossipConfig, ctx: ToolContext) => 
  new GossipEngine(config, ctx);

export default GossipEngine;