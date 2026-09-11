# Integración: red-de-intercambio-federada-isaacko → Automaton-HSCSG

**Repo origen:** red-de-intercambio-federada-isaacko (Red de Intercambio Federada)
**Fecha:** 2026-09-11

## Triple Perspectiva

### 1. Usuario (Qué quiere lograr)
- Tener la **Red de Intercambio Federada** como infraestructura backend en Automaton-HSCSG
- Nodos federados para intercambio económico (crédito bilateral, pools globales, baskets)
- Orquestador PSG para coordinación multi-agente
- POS Android + firmware para operación física (ferias conuqueras, ecoaldeas)
- Investment Agent autónomo para gestión de tesorería

### 2. LLM (Qué asimilar / qué extirpar)

**ASIMILAR (Lógica pura → Módulos Automaton-HSCSG):**

| Componente RIDF | Módulo Automaton-HSCSG | Mapeo |
|---|---|---|
| Motor PSG (Orquestador) | `src/core/lib/psg-orchestrator.ts` | Orquestación multi-agente |
| Bilateral Pools / Global Pool | `src/core/lib/federal-pools.ts` | Pools de crédito federados |
| Credit/Debit bilateral (Trustlines-like) | `src/core/lib/bilateral-credit.ts` | Crédito bilateral simétrico |
| Baskets (canastas de valor) | `src/core/lib/baskets.ts` | Canastas multi-activo |
| Energy Metrics (métricas energéticas) | `src/core/lib/energy-metrics.ts` | Contabilidad biofísica |
| Reconciliation (conciliación) | `src/core/lib/reconciliation.ts` | Conciliación cross-nodo |
| Investment Agent | `src/agent/tools/investment-agent.ts` | Agente tesorería autónomo |
| Skills System (Go) | `src/core/lib/go-skills-adapter.ts` | Adapter skills Go→TypeScript |
| Cron Jobs (Go) | `src/heartbeat/federal-cron.ts` | Cron federado |
| Scratchpad persistente | `src/memory/federal-scratchpad.ts` | Memoria cross-nodo |
| Multi-provider LLM (Go) | `src/inference/federal-llm-router.ts` | Router LLM federado |
| Governance federada | `src/core/lib/federal-governance.ts` | Gobernanza multi-nodo |
| NFC Package | `src/core/lib/nfc-federal.ts` | NFC para intercambio físico |
| POS Android | `src/core/lib/pos-federal.ts` | Interfaz POS móvil |

**EXTIRPAR (Infra ajena):**
- Go runtime / binaries → Lógica pura TypeScript (agnóstica)
- YugabyteDB / SQL distribuido → SQLite local + sync pattern documentado
- NATS / gRPC → Message passing via Automaton social layer
- Docker / K8s / KubeVela → Patrones de deployment documentados
- Firmware C/Embedded → Especificación protocolo NFC (no firmware)
- Android POS Kotlin → Especificación API POS (no app)

### 3. HSCSG + CaaS (Isomorfismo Leyes I/II/III + CaaS)

| Ley HSCSG | Aplicación en Red Federada |
|---|---|
| **Ley I (No dañar base material/personas)** | Pools bilaterales no extraen valor; Global Pool redistribuye en crisis; Energy metrics = contabilidad biofísica real |
| **Ley II (Ganarse la vida soberanizando = AUT×CDS)** | Crédito bilateral mutuo = soberanía financiera; Investment Agent = AUT autónomo; POS = CDS físico |
| **Ley III (Lucidez, nunca engañar)** | Conciliación cross-nodo = transparencia; Governance federada = lucidez colectiva; NFC = verificación física |

**CaaS Mapping Federal:**
- **FREE** → Nodo básico (crédito bilateral local, pool local)
- **PRO** → Nodo federado (global pool, baskets, investment agent)
- **ENTERPRISE** → Hub federal (orquestador PSG, governance, reconciliation)
- **Trustlines Federal** → Crédito bilateral cross-nodo (extensión Trustlines)
- **Daily Tick Federal** → Regeneración cross-nodo (PSG heartbeat)
- **PriceParity Federal** → Oracle multi-nodo (consenso de precios)

## Módulos Automaton-HSCSG a Crear

### 1. `src/core/lib/psg-orchestrator.ts`
```typescript
// Orquestador PSG: coordina agentes, tareas, recursos cross-nodo
export interface PSGTask { id, type, payload, priority, nodeAffinity }
export interface PSGNode { id, capabilities, capacity, load }
export class PSGOrchestrator { schedule(), allocate(), monitor(), rebalance() }
```

### 2. `src/core/lib/federal-pools.ts`
```typescript
// Pools federados: Global Pool + Bilateral Pools + Baskets
export interface FederalPool { id, type: 'global'|'bilateral'|'basket', members, assets, rules }
export interface Basket { id, assets: AssetWeight[], rebalanceRule, priceOracle }
```

### 3. `src/core/lib/bilateral-credit.ts`
```typescript
// Crédito bilateral simétrico (Trustlines federal)
export interface BilateralLine { nodeA, nodeB, creditLimit, debitLimit, balance, currency }
export function adjustCredit(), settle(), routePayment()
```

### 4. `src/core/lib/baskets.ts`
```typescript
// Canastas multi-activo con rebalance automático
export interface AssetWeight { asset, weight, minWeight, maxWeight }
export function createBasket(), rebalance(), value()
```

### 5. `src/core/lib/energy-metrics.ts`
```typescript
// Contabilidad biofísica: joules, emergy, EROI
export interface EnergyMetric { joules, emergy, eeroi, timestamp, node }
export function measure(), aggregate(), report()
```

### 6. `src/agent/tools/investment-agent.ts`
```typescript
// Agente inversión autónomo: tesorería, yield, risk
export interface InvestmentStrategy { riskProfile, assets, rebalanceThreshold }
export async function manageTreasury(), executeYield(), assessRisk()
```

### 7. `src/heartbeat/federal-cron.ts`
```typescript
// Cron federado: PSG heartbeat, pool rebalance, reconciliation
export interface FederalCronJob { id, schedule, nodes, payload }
export function register(), execute(), monitor()
```

### 8. `src/memory/federal-scratchpad.ts`
```typescript
// Scratchpad cross-nodo persistente
export interface ScratchpadEntry { id, node, namespace, key, value, ttl, signature }
export function write(), read(), sync(), gc()
```

### 9. `src/inference/federal-llm-router.ts`
```typescript
// Router LLM multi-provider federado
export interface LLMProvider { name, endpoint, capabilities, cost, latency }
export function route(), fallback(), loadBalance()
```

### 10. `src/core/lib/federal-governance.ts`
```typescript
// Gobernanza federada: propuestas, votaciones, veto triple
export interface Proposal { id, author, type, payload, votingPeriod, quorum }
export function propose(), vote(), execute(), veto()
```

### 11. `src/core/lib/nfc-federal.ts` + `src/core/lib/pos-federal.ts`
```typescript
// NFC para intercambio físico + API POS
export interface NFCTransaction { from, to, amount, currency, timestamp, signature }
export interface POSOrder { items, total, currency, paymentMethod: 'nfc'|'qr'|'cash' }
```

## Pantallas Automaton-HSCSG
- `src/app/screens/FederalDashboard.tsx` — Dashboard red federada (nodos, pools, flujos)
- `src/app/screens/FederalPOS.tsx` — Interfaz POS para ferias/ecoaldeas
- `src/app/screens/InvestmentAgent.tsx` — Control agente inversión

## Nav + Ruta
- Aside.tsx: icon `Network` → `federal` route + submenu
- App.tsx: imports + Routes

## Vasos Comunicantes (Cross-Repo)

| Fuente RIDF | Vaso Comunicante Automaton-HSCSG |
|---|---|
| `internal/orchestrator/` (PSG) | `[src/core/lib/psg-orchestrator.ts]` |
| `internal/agent/investment-agent/` | `[src/agent/tools/investment-agent.ts]` |
| `internal/skills/` (Go) | Adapter skills Go→TS |
| `cmd/investment-agent/` | Entrypoint agente inversión |
| `network/` (protocolos) | `[src/core/lib/federal-protocols.ts]` |
| `pos/` (Android) | `[src/core/lib/pos-federal.ts]` |
| `firmware/` (NFC) | `[src/core/lib/nfc-federal.ts]` |
| `docker-compose.yml` | Patrón deployment documentado |
| `PLAN_FEDERACION_GLOBAL.md` | `[docs/federal-plan.md]` |
| `ridf-orchestrator-state.json` | Estado inicial para tests |

## Archivos a Crear en Automaton-HSCSG

```
src/core/lib/psg-orchestrator.ts
src/core/lib/federal-pools.ts
src/core/lib/bilateral-credit.ts
src/core/lib/baskets.ts
src/core/lib/energy-metrics.ts
src/core/lib/reconciliation.ts
src/core/lib/federal-governance.ts
src/core/lib/nfc-federal.ts
src/core/lib/pos-federal.ts
src/agent/tools/investment-agent.ts
src/heartbeat/federal-cron.ts
src/memory/federal-scratchpad.ts
src/inference/federal-llm-router.ts
src/app/screens/FederalDashboard.tsx
src/app/screens/FederalPOS.tsx
src/app/screens/InvestmentAgent.tsx
# Nav: Aside.tsx (icon Network) + App.tsx
```

## Próximos Pasos
1. Crear módulos core (Fase 3)
2. Crear pantallas Federal
3. Añadir nav + rutas
4. Verificar build + tests
5. Commit + push + tag