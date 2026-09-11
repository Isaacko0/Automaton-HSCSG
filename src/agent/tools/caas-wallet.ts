// src/agent/tools/caas-wallet.ts
// Automaton-HSCSG — CaaS Wallet Tool (asimilado desde Zeitnus-Firma-Operaciones-Ecotomica)
// Herramienta agente: connect DID, getBalances, upgradeTier, verifyAccess, recordUsage, createTrustline

import { ulid } from "ulid";
import type { AutomatonTool, ToolContext, ToolCategory, RiskLevel, ToolCallResult, CaaSTier, JSONSchema } from "../../types.js";
import { caasEngine } from "../../core/lib/caas-engine.js";
import { createLogger } from "../../observability/logger.js";

const logger = console; // TODO: usar logger oficial

// ─── CaaS Wallet Tools ────────────────────────────────────────

export function createCaaSWalletTools(): AutomatonTool[] {
  return [
    {
      name: "caas_connect",
      description: "Conecta wallet CaaS con DID. Crea usuario si no existe. Retorna tier, ZNU balance, FRNE earned.",
      category: "caas" as ToolCategory,
      riskLevel: "safe" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "DID del usuario (ej: did:hsccsg:user:abc123)" }
        },
        required: ["did"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = args.did as string;
        const user = await caasEngine.getOrCreateUser(did);
        
        return `Wallet conectado:
DID: ${user.did}
Tier: ${user.tier}
ZNU Balance: ${user.znuBalance.toLocaleString()} ZNU
FRNE Ganado: ${user.frneEarned.toLocaleString()} FRNE
Tools Used This Month: ${user.toolsUsedThisMonth}
API Calls This Month: ${user.apiCallsThisMonth}
Trustlines: ${user.trustlines.length}
Creado: ${new Date(user.createdAt).toLocaleString()}
Última actividad: ${new Date(user.lastActiveAt).toLocaleString()}`;
      }
    },
    
    {
      name: "caas_balances",
      description: "Obtiene balances ZNU/FRNE y conversión USD del usuario actual.",
      category: "caas" as ToolCategory,
      riskLevel: "safe" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "DID del usuario (opcional, usa el conectado)" }
        }
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = (args.did as string) || ctx.identity.did;
        if (!did) return "No DID proporcionado. Usa caas_connect primero.";
        
        const user = await caasEngine.getOrCreateUser(did);
        const znuUsd = caasEngine.znuToUsd(user.znuBalance);
        const monthlyRevenue = caasEngine.getMonthlyRevenueUsd(user.tier);
        
        return `Balances CaaS:
DID: ${user.did}
Tier: ${user.tier}
ZNU: ${user.znuBalance.toLocaleString()} ZNU ≈ $${znuUsd.toFixed(2)} USD
FRNE: ${user.frneEarned.toLocaleString()} FRNE
Ingreso mensual estimado (si PRO/ENTERPRISE): $${monthlyRevenue.toFixed(2)} USD
Price Parity: 1 ZNU = $${caasEngine.getPriceParity()} USD`;
      }
    },
    
    {
      name: "caas_upgrade_tier",
      description: "Actualiza tier CaaS (quema ZNU, emite FRNE). Tiers: PRO (1000 ZNU/19€), ENTERPRISE (5000 ZNU/59€).",
      category: "caas" as ToolCategory,
      riskLevel: "caution" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "DID del usuario" },
          tier: { type: "string", enum: ["PRO", "ENTERPRISE"], description: "Tier objetivo" }
        },
        required: ["did", "tier"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = args.did as string;
        const tier = args.tier as "PRO" | "ENTERPRISE";
        
        const result = await caasEngine.upgradeTier(did, tier);
        
        if (!result.success) {
          return `Error: ${result.reason}`;
        }
        
        const user = await caasEngine.getOrCreateUser(did);
        return `¡Tier actualizado a ${tier}!
ZNU quemados: ${caasEngine.getTierConfig(tier).znuCost.toLocaleString()} ZNU
FRNE emitidos: ${caasEngine.getTierConfig(tier).frneEmission.toLocaleString()} FRNE
Nuevo balance: ${user.znuBalance.toLocaleString()} ZNU
FRNE total: ${user.frneEarned.toLocaleString()} FRNE`;
      }
    },
    
    {
      name: "caas_verify_access",
      description: "Verifica acceso a herramienta CaaS (run/export/api_call). Retorna allowed/reason/tier requerido.",
      category: "caas" as ToolCategory,
      riskLevel: "safe" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "DID del usuario" },
          toolId: { type: "string", description: "ID de la herramienta (slug)" },
          action: { type: "string", enum: ["run", "export", "api_call"], description: "Acción a verificar" }
        },
        required: ["did", "toolId", "action"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = args.did as string;
        const toolId = args.toolId as string;
        const action = args.action as "run" | "export" | "api_call";
        
        const result = await caasEngine.verifyAccess(did, toolId, action);
        
        let output = `Access Check: ${result.allowed ? "ALLOWED" : "DENIED"}
Tier usuario: ${result.tier}
Tier requerido: ${result.requiredTier || "N/A"}`;
        
        if (!result.allowed && result.reason) {
          output += `\nRazón: ${result.reason}`;
        }
        
        return output;
      }
    },
    
    {
      name: "caas_record_usage",
      description: "Registra uso de herramienta CaaS (emite FRNE, actualiza métricas). Acciones: run, export, api_call, create.",
      category: "caas" as ToolCategory,
      riskLevel: "safe" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "DID del usuario" },
          toolId: { type: "string", description: "ID de la herramienta" },
          action: { type: "string", enum: ["run", "export", "api_call", "create"], description: "Tipo de uso" },
          metadata: { type: "object", description: "Metadata adicional (opcional)" }
        },
        required: ["did", "toolId", "action"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = args.did as string;
        const toolId = args.toolId as string;
        const action = args.action as "run" | "export" | "api_call";
        const metadata = (args.metadata as Record<string, any>) || {};
        
        const contribution = await caasEngine.recordUsage(did, toolId, action, metadata);
        
        return `Uso registrado:
Tool: ${toolId}
Acción: ${action}
Tier: ${contribution.tier}
FRNE Emitido: ${contribution.frneEmitted.toLocaleString()} FRNE
Timestamp: ${new Date(contribution.timestamp).toLocaleString()}`;
      }
    },
    
    {
      name: "caas_create_trustline",
      description: "Crea Trustline B2B bilateral con contraparte. Crédito bilateral sin intermediarios.",
      category: "caas" as ToolCategory,
      riskLevel: "caution" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "Tu DID" },
          counterparty: { type: "string", description: "DID contraparte" },
          creditLimit: { type: "string", description: "Límite de crédito (bigint string)" },
          debitLimit: { type: "string", description: "Límite de débito (bigint string)" },
          currency: { type: "string", enum: ["ZNU", "FRNE", "USD"], default: "ZNU" }
        },
        required: ["did", "counterparty", "creditLimit", "debitLimit"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = args.did as string;
        const counterparty = args.counterparty as string;
        const creditLimit = BigInt(args.creditLimit as string);
        const debitLimit = BigInt(args.debitLimit as string);
        const currency = (args.currency as "ZNU" | "FRNE" | "USD") || "ZNU";
        
        try {
          const trustline = await caasEngine.createTrustline(did, counterparty, creditLimit, debitLimit, currency);
          return `Trustline creada:
Contraparte: ${trustline.counterparty}
Límite crédito: ${trustline.creditLimit.toLocaleString()} ${trustline.currency}
Límite débito: ${trustline.debitLimit.toLocaleString()} ${trustline.currency}
Balance: ${trustline.balance.toLocaleString()} ${trustline.currency}
Activa: ${trustline.active}`;
        } catch (err) {
          return `Error: ${err instanceof Error ? err.message : String(err)}`;
        }
      }
    },
    
    {
      name: "caas_settle_trustline",
      description: "Liquida Trustline bilateral (ajusta balance). Amount positivo = nos deben, negativo = debemos.",
      category: "caas" as ToolCategory,
      riskLevel: "caution" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "Tu DID" },
          counterparty: { type: "string", description: "DID contraparte" },
          amount: { type: "string", description: "Monto a liquidar (bigint string, positivo = crédito, negativo = débito)" }
        },
        required: ["did", "counterparty", "amount"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const did = args.did as string;
        const counterparty = args.counterparty as string;
        const amount = BigInt(args.amount as string);
        
        try {
          const result = await caasEngine.settleTrustline(did, counterparty, amount);
          return `Liquidación ${result.success ? "EXITOSA" : "FALLIDA"}:
Nuevo balance: ${result.newBalance.toLocaleString()} ZNU`;
        } catch (err) {
          return `Error: ${err instanceof Error ? err.message : String(err)}`;
        }
      }
    },
    
    {
      name: "caas_analytics",
      description: "Obtiene analytics globales CaaS: usuarios por tier, tools, FRNE circulante, ZNU held, MRR USD, top tools.",
      category: "caas" as ToolCategory,
      riskLevel: "safe" as RiskLevel,
      parameters: { type: "object", properties: {} },
      execute: async (_args: Record<string, unknown>, ctx: ToolContext) => {
        const analytics = caasEngine.getAnalytics();
        
        return `CaaS Analytics:
Usuarios totales: ${analytics.totalUsers}
  FREE: ${analytics.usersByTier.FREE}
  PRO: ${analytics.usersByTier.PRO}
  ENTERPRISE: ${analytics.usersByTier.ENTERPRISE}
Tools totales: ${analytics.totalTools}
  FREE: ${analytics.toolsByTier.FREE}
  PRO: ${analytics.toolsByTier.PRO}
  ENTERPRISE: ${analytics.toolsByTier.ENTERPRISE}
FRNE Circulante: ${analytics.totalFrneCirculating.toLocaleString()} FRNE
ZNU En poder usuarios: ${analytics.totalZnuHeld.toLocaleString()} ZNU
MRR (USD): $${analytics.monthlyRecurringUsd.toFixed(2)}
Top Tools:
${analytics.topTools.map((t, i) => `${i+1}. ${t.id}: ${t.runs.toLocaleString()} runs, ${t.frne.toLocaleString()} FRNE`).join("\n") || "  (ninguno)"}`;
      }
    },
    
    {
      name: "caas_daily_tick",
      description: "Ejecuta daily tick CaaS (reset mensual, FRNE staking, price parity). Solo admin/sistema.",
      category: "caas" as ToolCategory,
      riskLevel: "caution" as RiskLevel,
      parameters: { type: "object", properties: {} },
      execute: async (_args: Record<string, unknown>, ctx: ToolContext) => {
        const result = await caasEngine.dailyTick();
        
        return `Daily Tick ejecutado:
Timestamp: ${new Date(result.timestamp).toLocaleString()}
Usuarios activos: ${result.activeUsers}
FRNE Emitido (staking): ${result.totalFrneEmitted.toLocaleString()} FRNE
ZNU Quemado: ${result.totalZnuBurned.toLocaleString()} ZNU
Price Parity: 1 ZNU = $${result.priceParity} USD
Usuarios totales: ${result.totalUsers}
Tools totales: ${result.totalTools}`;
      }
    },
    
    {
      name: "caas_list_tools",
      description: "Lista herramientas CaaS registradas. Filtra por tier opcional.",
      category: "caas" as ToolCategory,
      riskLevel: "safe" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          tier: { type: "string", enum: ["FREE", "PRO", "ENTERPRISE"], description: "Filtrar por tier" }
        }
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const tier = args.tier as "FREE" | "PRO" | "ENTERPRISE" | undefined;
        const tools = caasEngine.listTools(tier);
        
        if (tools.length === 0) return "No hay herramientas registradas.";
        
        return tools.map(t => 
          `${t.id} (${t.tier}): ${t.name} - ${t.description} [${t.category}] - ${t.tags.join(", ")}`
        ).join("\n");
      }
    },
    
    {
      name: "caas_register_tool",
      description: "Registra nueva herramienta en CaaS Engine (para creadores). Requiere deployment URL y schema.",
      category: "caas" as ToolCategory,
      riskLevel: "caution" as RiskLevel,
      parameters: {
        type: "object",
        properties: {
          did: { type: "string", description: "DID creador" },
          slug: { type: "string", description: "Slug único" },
          name: { type: "string", description: "Nombre herramienta" },
          description: { type: "string", description: "Descripción" },
          tier: { type: "string", enum: ["FREE", "PRO", "ENTERPRISE"], description: "Tier mínimo" },
          category: { type: "string", description: "Categoría" },
          tags: { type: "array", items: { type: "string" }, description: "Tags SEO" },
          deploymentUrl: { type: "string", description: "URL Vercel Edge Function" },
          inputSchema: { type: "object", description: "JSONSchema input" },
          outputSchema: { type: "object", description: "JSONSchema output" },
          configSchema: { type: "object", description: "JSONSchema config (opcional)" }
        },
        required: ["did", "slug", "name", "description", "tier", "category", "tags", "deploymentUrl", "inputSchema", "outputSchema"]
      },
      execute: async (args: Record<string, unknown>, ctx: ToolContext) => {
        const tool = await caasEngine.registerTool({
          id: args.slug as string,
          name: args.name as string,
          description: args.description as string,
          tier: args.tier as "FREE" | "PRO" | "ENTERPRISE",
          category: args.category as string,
          tags: (args.tags as string[]) || [],
          deploymentUrl: args.deploymentUrl as string,
          schema: {
            input: args.inputSchema as any,
            output: args.outputSchema as any,
            config: args.configSchema as any || {}
          },
          createdBy: ctx.identity.did || 'unknown'
        });
        
        return `Herramienta registrada en CaaS:
ID: ${tool.id}
Nombre: ${tool.name}
Tier: ${tool.tier}
Deployment: ${tool.deploymentUrl}
Creada: ${new Date(tool.createdAt).toLocaleString()}`;
      }
    }
  ];
}

export default createCaaSWalletTools;