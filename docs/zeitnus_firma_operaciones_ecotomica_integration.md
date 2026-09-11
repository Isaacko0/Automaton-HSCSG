# Integración: Zeitnus-Firma-Operaciones-Ecotomica → Automaton-HSCSG

**Repo origen:** Zeitnus-Firma-Operaciones-Ecotomica (HSCSG Tool Forge deployment)
**Fecha:** 2026-09-11

## Triple Perspectiva

### 1. Usuario (Qué quiere lograr)
- Tener el **HSCSG Tool Forge** operativo como módulo vivo en Automaton-HSCSG
- Generar micro-herramientas CaaS-powered que monetizan con ZNU/FRNE/Trustlines/AdSense
- QR 3D Generator como MVP Tool #1 (PNG/SVG/3MF/STL + Three.js preview)
- Deploy automático a Vercel Edge Functions vía GitHub Actions

### 2. LLM (Qué asimilar / qué extirpar)

**ASIMILAR (Lógica pura → Módulos Automaton-HSCSG):**
| Componente Zeitnus | Módulo Automaton-HSCSG | Mapeo |
|---|---|---|
| CaaS Engine (tiers, ZNU/FRNE, Trustlines, Daily Tick, PriceParity) | `src/core/lib/caas-engine.ts` + `src/core/state/caas.ts` | Lógica económica completa |
| Tool Generator (Spec→LLM→Sandbox→Deploy→CaaS Register) | `src/core/lib/tool-generator.ts` | Pipeline generativo |
| QR 3D Generator (QR→3MF/STL + Three.js) | `src/core/lib/qr-3d-generator.ts` | Herramienta MVP #1 |
| CaaS Wallet (DID, balances, tier upgrade, access gate) | `src/core/lib/caas-wallet.ts` + `src/agent/tools/caas-wallet.ts` | Wallet + herramienta agente |
| AdSense Placeholders (4 posiciones) | `src/core/lib/adsense.ts` | Monetización ads |
| SEO Automation (Schema.org, OG, Sitemap) | `src/core/lib/seo-automation.ts` | SEO técnico |

**EXTIRPAR (Infra ajena):**
- Next.js App Router + Vercel Edge Functions → Lógica pura TypeScript (agnóstica)
- Three.js runtime → Solo interfaz de export (Three.js corre en cliente, no en agente)
- GitHub Actions CI/CD → Patrón de pipeline documentado, no runtime
- localStorage/Zustand → Estado en SQLite (Automaton state layer)
- AdSense runtime → Placeholder + lógica de decisión (sí/no ads)

### 3. HSCSG + CaaS (Isomorfismo Leyes I/II/III + CaaS)

| Ley HSCSG | Aplicación en Tool Forge |
|---|---|
| **Ley I (No dañar base material/personas)** | Tool Forge no extrae valor sin consentimiento; AdSense solo en tier FREE (usuario elige) |
| **Ley II (Ganarse la vida soberanizando = AUT×CDS)** | Usuarios PRO queman ZNU → emiten FRNE; Trustlines B2B = crédito bilateral sin intermediarios; LoopEngine auto-genera herramientas long-tail |
| **Ley III (Lucidez, nunca engañar)** | Wallet muestra ZNU/FRNE reales; PriceParity oracle transparente; Access gate honesto sobre tier requerido |

**CaaS Mapping:**
- **FREE** (ads) → Supervivencia básica (Ley I)
- **PRO** (1000 ZNU/19€) → Soberanía operativa (Ley II)
- **ENTERPRISE** (5000 ZNU/59€) → Coordinación B2B (Ley III)
- **Trustlines** → Crédito bilateral mutuo (Ley II + III)
- **Daily Tick** → Regeneración automática (Ley I + II)
- **PriceParity** → Transparencia valor (Ley III)

## Módulos Automaton-HSCSG a Crear

### 1. `src/core/state/caas.ts` + `src/core/lib/caas-engine.ts`
```typescript
// Tipos CaaS completos
export type CaaSTier = 'FREE' | 'PRO' | 'ENTERPRISE';
export interface CaaSUser { did: string; tier: CaaSTier; znuBalance: bigint; frneEarned: bigint; ... }
export interface Trustline { counterparty: string; creditLimit: bigint; debitLimit: bigint; balance: bigint; ... }
export interface AccessResult { allowed: boolean; reason?: string; tier: CaaSTier; requiredTier?: CaaSTier; }

// Lógica pura: tiers, upgrade (burn ZNU, emit FRNE), verifyAccess, recordUsage, dailyTick, priceParity
```

### 2. `src/core/lib/tool-generator.ts`
```typescript
// Spec → LLM Code → Sandbox Test → Deploy → CaaS Register
export interface ToolSpec { slug, name, description, tier, inputSchema, outputSchema, promptTemplate, testCases, seo }
export const MVP_TOOL_SPECS: ToolSpec[] = [QR3D, MortgageTax, PDFCompressor, FreelanceContract, SchemaValidator]
```

### 3. `src/core/lib/qr-3d-generator.ts`
```typescript
// QR 3D Generator: PNG/SVG/3MF/STL + Three.js preview
export interface QR3DInput { url, baseColor, qrColor, shape: 'stand'|'keychain'|'plate', text, emoji }
export interface QR3DOutput { png, svg, '3mf', stl, preview3d }
export async function executeQR3DGenerator(input: QR3DInput): Promise<QR3DOutput>
```

### 4. `src/agent/tools/caas-wallet.ts` + `src/core/lib/caas-wallet.ts`
```typescript
// Herramienta agente: connect DID, getBalances, upgradeTier, verifyAccess, recordUsage
// Integración con Automaton tool registry
```

### 5. `src/core/lib/adsense.ts` + `src/core/lib/seo-automation.ts`
```typescript
// AdSense: 4 placeholders (top-banner, mid-content, download-popup, corner-notification)
// SEO: Schema.org SoftwareApplication, OG/Twitter, Sitemap, Core Web Vitals
```

## Pantalla Automaton-HSCSG
- `src/app/screens/ToolForge.tsx` — Dashboard Tool Forge con wallet, lista herramientas, generador

## Nav + Ruta
- Aside.tsx: icon `Zap` → `toolforge` route
- App.tsx: import + Route

## Vasos Comunicantes (Cross-Repo)

| Fuente | Vaso Comunicante |
|---|---|
| `caas-engine.ts` (Zeitnus) | `[src/core/lib/caas-engine.ts]` — Lógica económica idéntica |
| `tool-generator.ts` (Zeitnus) | `[src/core/lib/tool-generator.ts]` — Pipeline generativo |
| `qr-3d-generator.ts` (Zeitnus) | `[src/core/lib/qr-3d-generator.ts]` — MVP Tool #1 |
| `CaaSWallet.tsx` (Zeitnus) | `[src/agent/tools/caas-wallet.ts]` — Herramienta agente |
| `.github/workflows/tool-forge.yml` | Patrón CI/CD → Documentado en `docs/ci-cd-patterns.md` |
| Deploy Vercel | Patrón Edge Functions → `docs/edge-functions-pattern.md` |

## Archivos a Crear en Automaton-HSCSG

```
src/core/state/caas.ts
src/core/lib/caas-engine.ts
src/core/lib/tool-generator.ts
src/core/lib/qr-3d-generator.ts
src/core/lib/caas-wallet.ts
src/agent/tools/caas-wallet.ts
src/core/lib/adsense.ts
src/core/lib/seo-automation.ts
src/app/screens/ToolForge.tsx
# Nav: Aside.tsx (icon Zap) + App.tsx
```

## Próximos Pasos
1. Crear módulos core (Fase 3)
2. Crear pantalla ToolForge
3. Añadir nav + ruta
4. Verificar build + tests
5. Commit + push + tag
