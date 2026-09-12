---
name: hscsg-next-steps-orchestrator
description: Orquesta próximos pasos HSCSG con priorización dinámica, registro de tareas usuario+agente, grafo de dependencias, continuity y detección automática de gaps documentales.
version: 0.3.0
author: Isaac Ko (Isaacko0), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hscsg, orchestration, next-steps, copiosis, deseos, automaton, deploy, prioritization, brief-detection]
    related_skills: [plan, hermes-agent-skill-authoring, brief-detector-recommender]
---

# HSCSG Next Steps Orchestrator Skill

Orquesta la hoja de ruta post-brief con **priorización dinámica**: registra tareas propuestas por el agente Y decisiones del usuario, muestra grafo de dependencias, y al invocarse presenta lista interactiva de qué hacer primero según criterios (valor, dependencias, esfuerzo, decisión usuario).

## When to Use

- Tras completar brief exhaustivo + índice briefs + CoachFAB Happpy style
- Usuario dice "siguiente paso", "continúa", "ejecuta hoja de ruta", "P0 specs", "prioriza"
- Cada nueva sesión para retomar donde se quedó (continuity) + revisar prioridades
- Verificación semanal de progreso en hoja de ruta
- Usuario quiere añadir/quitar/reordenar tareas propias

## Prerequisites

- Repo `navteka` clonado y en `master` (origin: `https://github.com/Isaacko0/navteka`)
- Node 24.19 + pnpm 10.12.1 (corepack) instalados
- DeseOS extraído en `/c/Users/Isaacko0/Downloads/Desktop/HSCSG dinero flores/nuevas integraciones/DeseOS_extracted/DeseOS_project1/`
- Vercel CLI autenticado (`vercel login`) para deploy verification
- Git credential manager configurado (push sin tokens)

## How to Run

```bash
# Invocación interactiva (recomendada) - presenta menú de priorización
pnpm --filter @navteka/hscsg-core run orchestrator:next-steps

# Comandos directos:
# terminal(command="cd /c/Users/Isaacko0/navteka && node scripts/orchestrator-next-steps.js status", timeout=60)
# terminal(command="cd /c/Users/Isaacko0/navteka && node scripts/orchestrator-next-steps.js run P0", timeout=300)
# terminal(command="cd /c/Users/Isaacko0/navteka && node scripts/orchestrator-next-steps.js add-task", timeout=60)
# terminal(command="cd /c/Users/Isaacko0/navteka && node scripts/orchestrator-next-steps.js reprioritize", timeout=60)
```

## Quick Reference

| Comando | Acción |
|---------|--------|
| `orchestrator:status` | Estado actual: workstreams, tareas pendientes, grafo dependencias, próxima acción recomendada |
| `orchestrator:run <WORKSTREAM>` | Ejecuta workstream específico (P0, MIGRATION, COACH, ROLES, DEPLOY, o task ID custom) |
| `orchestrator:run ALL` | Ejecuta en orden topológico respetando dependencias |
| `orchestrator:add-task` | Añade tarea custom (usuario define: nombre, deps, valor, esfuerzo, workstream) |
| `orchestrator:reprioritize` | Reordena interactivamente: muestra lista con scores, usuario marca prioridad |
| `orchestrator:graph` | Muestra grafo de dependencias ASCII + críticas path |
| `orchestrator:next` | Recomienda próxima tarea óptima (max valor / min esfuerzo / desbloquea más) |

## Task Registry (Persistido en `orchestrator-state.json`)

Cada tarea tiene:
```json
{
  "id": "P0-netbenefit",
  "title": "Crear lib/netbenefit.ts",
  "workstream": "P0_SPECS",
  "source": "agent",           // "agent" | "user"
  "priority": 90,              // 0-100 (usuario puede sobrescribir)
  "effort": 3,                 // 1-5 (días estimados)
  "value": 95,                 // 1-100 impacto estratégico
  "dependencies": [],          // IDs de tareas que deben completarse antes
  "blocks": ["P0-cds_jurados"], // IDs que esta tarea desbloquea
  "status": "pending",         // pending | in_progress | done | blocked | cancelled
  "created": "2026-08-22T10:00:00Z",
  "updated": "2026-08-22T10:00:00Z",
  "notes": "Motor BN 8 escalas + pesos CDS_Jurados"
}
```

## Procedure

### 1. INVOCACIÓN: Menú interactivo de priorización (SIEMPRE primer paso)

Al llamar la skill (vía `orchestrator:status` o sin args), **siempre** presenta:

```
╔═══════════════════════════════════════════════════════════════════╗
║  HSCSG NEXT STEPS ORCHESTRATOR — Ciclo 1                          ║
║  Estado: 3/47 tareas completadas | Workstream activo: P0_SPECS    ║
╠═══════════════════════════════════════════════════════════════════╣
║  PRÓXIMAS ACCIONES RECOMENDADAS (orden topológico + prioridad):   ║
║                                                                   ║
║  1. [P0-netbenefit]     P0_SPECS     ●●●○○ Esf:3 Val:95 Dep:0   ║
║       └─> Motor NetBenefit 8 escalas + CDS_Jurados weights       ║
║  2. [P0-cds_jurados]    P0_SPECS     ●●●○○ Esf:3 Val:90 Dep:1   ║
│       └─> Jury summon, weights, actas RAO (requiere P0-netbenefit)│
║  3. [P0-copiosis]       P0_SPECS     ●●●○○ Esf:2 Val:88 Dep:1   ║
│       └─> NetBenefitFlow, GoodType, LuxuryPriceNBR (requiere netbenefit)│
║  4. [MIG-P1-BranDNA]    MIGRATION    ●●●●○ Esf:5 Val:92 Dep:0   ║
│       └─> Migrar P1 BranDNA + store integration (base para P5)    │
║  5. [COACH-automaton]   COACH        ●●●●○ Esf:5 Val:90 Dep:2   ║
│       └─> lib/automaton.ts + useAutomaton hook (requiere P0 specs)│
║  ...                                                             ║
║                                                                   ║
║  TAREAS USUARIO PENDIENTES:                                       ║
║  U-001: "Integrar neko-room-recording"  (workstream: DEPLOY)     ║
║  U-002: "Añadir tests E2E CoachFAB"     (workstream: COACH)      ║
║                                                                   ║
║  ACCIONES: [1-5] Ejecutar  |  [a] Añadir tarea  |  [r] Repriorizar│
║            [g] Ver grafo  |  [n] Próxima óptima |  [q] Salir      ║
╚═══════════════════════════════════════════════════════════════════╝
```

**El usuario elige:** número para ejecutar, `a` para añadir su tarea, `r` para reordenar, `g` para ver grafo, `n` para recomendación automática.

---

### 2. REGISTRO DE TAREAS (Agente + Usuario)

#### Tareas base del agente (pre-cargadas en primer run):
```json
{
  "P0_SPECS": [
    {"id": "P0-netbenefit", "title": "Crear lib/netbenefit.ts", "deps": [], "effort": 3, "value": 95},
    {"id": "P0-cds_jurados", "title": "Crear lib/cds_jurados.ts", "deps": ["P0-netbenefit"], "effort": 3, "value": 90},
    {"id": "P0-copiosis", "title": "Crear lib/copiosis.ts", "deps": ["P0-netbenefit"], "effort": 2, "value": 88},
    {"id": "P0-valueflows", "title": "Extender ValueFlows types", "deps": ["P0-copiosis"], "effort": 1, "value": 85}
  ],
  "MIGRATION": [
    {"id": "MIG-P1-BranDNA", "title": "Migrar P1 BranDNA + store", "deps": [], "effort": 5, "value": 92},
    {"id": "MIG-P2-Products", "title": "Migrar P2 Products", "deps": ["MIG-P1-BranDNA"], "effort": 4, "value": 88},
    {"id": "MIG-P3-Personas", "title": "Migrar P3 Personas/CRM", "deps": ["MIG-P1-BranDNA"], "effort": 5, "value": 85},
    {"id": "MIG-P4-Plan", "title": "Migrar P4 StrategicBrain", "deps": ["MIG-P2-Products", "MIG-P3-Personas"], "effort": 4, "value": 90},
    {"id": "MIG-P5-Produce", "title": "Migrar P5 VITCH + auto-llenado P1→P5", "deps": ["MIG-P1-BranDNA", "MIG-P4-Plan"], "effort": 5, "value": 95},
    {"id": "MIG-P6-Persuade", "title": "Migrar P6 CloserAI", "deps": ["MIG-P1-BranDNA"], "effort": 4, "value": 82},
    {"id": "MIG-P7-Pauta", "title": "Migrar P7 MediaBuyer", "deps": ["MIG-P4-Plan"], "effort": 4, "value": 85},
    {"id": "MIG-P8-Pagos", "title": "Migrar P8 RevenueThermometer", "deps": ["MIG-P2-Products"], "effort": 3, "value": 80},
    {"id": "MIG-P9-Perfecciona", "title": "Migrar P9 QA/Iteration", "deps": ["MIG-P5-Produce"], "effort": 3, "value": 78},
    {"id": "MIG-P10-Publica", "title": "Migrar P10 Publica/Radar", "deps": ["MIG-P5-Produce"], "effort": 3, "value": 75},
    {"id": "MIG-P11-Prospecta", "title": "Migrar P11 Scout/LeadGen", "deps": ["MIG-P3-Personas"], "effort": 3, "value": 77}
  ],
  "COACH": [
    {"id": "COACH-automaton", "title": "Crear lib/automaton.ts (SOUL, E²R, MJ Gate)", "deps": ["P0-netbenefit", "P0-copiosis"], "effort": 5, "value": 90},
    {"id": "COACH-hook", "title": "Crear hook useAutomaton()", "deps": ["COACH-automaton"], "effort": 2, "value": 88},
    {"id": "COACH-integration", "title": "Refactor CoachFAB → useAutomaton + BranDNA context", "deps": ["COACH-hook", "MIG-P1-BranDNA"], "effort": 3, "value": 92},
    {"id": "COACH-lucidez", "title": "Modo Lucidez Material toggle en CoachFAB", "deps": ["COACH-integration"], "effort": 2, "value": 85}
  ],
  "ROLES": [
    {"id": "ROLES-mapping", "title": "Definir mapping DeseOS→Coworkers en coworkerRoles.ts", "deps": [], "effort": 1, "value": 80},
    {"id": "ROLES-state", "title": "Actualizar coworkers.ts con deseosRole + seeds", "deps": ["ROLES-mapping"], "effort": 2, "value": 82},
    {"id": "ROLES-ui", "title": "UI Coworkers: badges Creative/Operator, filtros", "deps": ["ROLES-state"], "effort": 2, "value": 78}
  ],
  "DEPLOY": [
    {"id": "DEPLOY-link", "title": "Vercel link + env vars + deploy prod", "deps": [], "effort": 2, "value": 95},
    {"id": "DEPLOY-verify", "title": "Verificar rutas 200 + CoachFAB visible", "deps": ["DEPLOY-link"], "effort": 1, "value": 90},
    {"id": "DEPLOY-auto", "title": "Configurar auto-deploy on push", "deps": ["DEPLOY-verify"], "effort": 1, "value": 85}
  ],
  "VAULT_MODULES": [
    {"id": "VAULT-lucidez_material", "title": "Implementar lib/lucidez_material.ts (Pirámide 4 niveles MJ)", "deps": [], "effort": 2, "value": 90},
    {"id": "VAULT-autovividasis", "title": "Implementar lib/autovividasis.ts (chequeo vivido vs calculado)", "deps": [], "effort": 2, "value": 88},
    {"id": "VAULT-urbion", "title": "Implementar lib/urbion.ts (Ontogénesis Urbana)", "deps": [], "effort": 2, "value": 85},
    {"id": "VAULT-karatani", "title": "Implementar lib/karatani.ts (Modos A/B/C/D)", "deps": [], "effort": 1, "value": 82},
    {"id": "VAULT-plan90", "title": "Implementar lib/plan_90_dias.ts (3 ciclos lunares)", "deps": [], "effort": 2, "value": 88},
    {"id": "VAULT-fases", "title": "Implementar lib/fases.ts (Fases 0→E + hard gates)", "deps": [], "effort": 2, "value": 85}
  ],
  "NEXTCLOUD": [
    {"id": "NC-fix-types", "title": "Corregir type mismatch en nextcloud (re-exportar tipos)", "deps": [], "effort": 1, "value": 95},
    {"id": "NC-build-verify", "title": "Build OK + push main (nextcloud asimilado)", "deps": ["NC-fix-types"], "effort": 1, "value": 90},
    {"id": "NC-brief-update", "title": "Actualizar BRIEF_EXHAUSTIVO con Nextcloud (Sección 20)", "deps": ["NC-build-verify"], "effort": 1, "value": 85},
    {"id": "NC-readme-update", "title": "Actualizar README.md con /nextcloud en Pantallas Clave", "deps": ["NC-build-verify"], "effort": 1, "value": 80}
  ]
}
```

#### Usuario añade tareas (`orchestrator:add-task`):
```
> Título: Integrar neko-room-recording
> Workstream: DEPLOY (o NEW)
> Dependencias: DEPLOY-link
> Esfuerzo (1-5): 3
> Valor (1-100): 70
> Notas: Grabación sesiones neko para replay/analytics
> Fuente: user
✅ Tarea U-001 registrada. Aparecerá en próximo menú.
```

---

### 3. ALGORITMO DE PRIORIZACIÓN (Recomendación `orchestrator:next`)

Score compuesto por tarea lista (dependencias completadas):
```
score = (value * 0.5) + ((6 - effort) * 10 * 0.3) + (unblocks * 15 * 0.2)
```
- `value`: impacto estratégico (1-100)
- `effort`: inverso (menos esfuerzo = más score)
- `unblocks`: cuántas tareas desbloquea (efecto multiplicador)

**Regla:** Solo sugiere tareas con `status=pending` Y `dependencies` todas `done`.

---

### 4. GRAFO DE DEPENDENCIAS (`orchestrator:graph`)

```
P0-netbenefit ──► P0-cds_jurados ──► P0-copiosis ──► P0-valueflows
     │                                    │
     └──────────────────► COACH-automaton ◄─┘
                                           │
MIG-P1-BranDNA ──────────────────────────►│
     │                                    │
     ├────► MIG-P2-Products ─────────────►│
     │         │                           │
     │         └────► MIG-P8-Pagos         │
     │                                     │
     └────► MIG-P3-Personas ──────────────►│
               │                           │
               └────► MIG-P11-Prospecta    │
                                           │
     MIG-P4-Plan ◄─────────────────────────┘
          │
          ├────► MIG-P7-Pauta
          │
          └────► MIG-P5-Produce ──► MIG-P9-Perfecciona
                       │
                       └────► MIG-P10-Publica
                       │
                       └────► COACH-integration (requiere BranDNA context)
                                    │
                                    ▼
                            COACH-lucidez
                                    │
ROLES-mapping ──► ROLES-state ──► ROLES-ui
                                    │
DEPLOY-link ──► DEPLOY-verify ──► DEPLOY-auto
```

**Critical Path:** `P0-netbenefit → P0-copiosis → COACH-automaton → COACH-integration → MIG-P5-Produce → MIG-P9/MIG-P10` (18 días mínimos)

---

### 5. EJECUCIÓN DE WORKSTREAMS (Detalle técnico resumido)

#### P0 SPECS (Workstream fundacional - desbloquea COACH + MIG-P5)
- `lib/netbenefit.ts`: NetBenefit Engine 8 escalas + CDS_Jurados weights
- `lib/cds_jurados.ts`: Jury summon, weights, actas RAO, rotation
- `lib/copiosis.ts`: NetBenefitFlow, GoodType, LuxuryPriceNBR, CapitalAccessTier, BNGradient
- `shared/types/valueflows.ts`: Extended EconomicEvent

#### MIGRATION (11 módulos DeseOS - orden topológico crítico)
- P1→P2→P3→P4→P5(auto-llenado)→P6/P7/P8/P9/P10/P11
- Cada módulo: core logic (ESM) + components + hooks + screen page + types + index.ts

#### COACH (Integración real Autómata + BranDNA)
- `lib/automaton.ts`: SOUL, tiers, heartbeat, E²R, MJ Gate, spawn
- `hooks/useAutomaton.ts`: Zustand integration
- `CoachFAB.tsx`: askAutomaton + BranDNA context + Lucidez toggle

#### ROLES (Mapeo DeseOS Creative/Operator → Coworkers)
- `lib/coworkerRoles.ts`: mapping 6 roles
- `coworkers.ts`: deseosRole field + seeds
- UI: badges, filtros, canales dedicados

#### DEPLOY (Vercel fix 404 → producción)
- `vercel link` + env vars + `vercel --prod`
- Verificación 200 en 4 rutas críticas
- Auto-deploy on push configurado

---

### 6. CONTINUITY PROTOCOL (Persistencia real)

Archivo: `orchestrator-state.json` en raíz navteka
```json
{
  "cycle": 1,
  "version": "0.2.0",
  "taskRegistry": { ... },  // Todas las tareas con status actualizado
  "currentWorkstream": "P0_SPECS",
  "currentTask": "P0-netbenefit",
  "completedTasks": ["P0-netbenefit"],
  "userPriorities": ["P0-netbenefit", "MIG-P1-BranDNA", "U-001"],
  "lastInteraction": "2026-08-22T14:30:00Z",
  "sessionLog": [
    {"timestamp": "...", "action": "run", "task": "P0-netbenefit", "result": "done"},
    {"timestamp": "...", "action": "add-task", "task": "U-001", "user": "Isaacko0"}
  ]
}
```

Al invocar skill:
1. Lee `orchestrator-state.json`
2. Recupera taskRegistry completo + userPriorities
3. Calcula tareas disponibles (deps done)
4. Presenta menú interactivo ordenado por score
5. Tras acción usuario: actualiza state + persiste

---

### 7. PITFALLS (Actualizados)

1. **DeseOS bundles son IIFE globales** — convertir a ESM exports
2. **localStorage keys DeseOS** → Zustand store con `partialize` por brand
3. **CSS variables Contento** ya en `globals.css` — usar `var(--chispa)`
4. **Autómata real** no existe — crear desde cero (Conway+OneManCompany specs)
5. **Vercel 404** = proyecto no linkado — `vercel link` + `vercel --prod` obligatorio
6. **Coworkers standing roles** alinear con Boundaries policy (deny>allow)
7. **Orden migración crítico**: P1→P2→P3→P4→P5 (P5 VITCH depende de P1 BranDNA)
8. **P0 specs desbloquean COACH + MIG-P5** — priorizar P0 primero
9. **Tareas usuario** se guardan con `source: "user"` y prioridad respetada

---

### 8. VERIFICATION CHECKLIST (Por workstream)

- [ ] **P0 SPECS**: 4 archivos, build pasa, types exportados, valueflows extendido
- [ ] **MIGRATION**: 11 módulos en `src/modules/`, 11 rutas funcionando, auto-llenado P1→P5 demo
- [ ] **COACH**: CoachFAB usa `useAutomaton()`, inyecta BranDNA, modo Lucidez muestra raw data
- [ ] **ROLES**: 6+ coworkers seed con `deseosRole`, badges UI, canales dedicados
- [ ] **DEPLOY**: `https://navteka.vercel.app` 200, `/coach` 200, CoachFAB visible, auto-deploy on push

---

### 9. RELATED SKILLS

- `plan` — para crear plan detallado por workstream
- `hermes-agent-skill-authoring` — estándares para documentar cada módulo migrado como skill
- `brief-detector-recommender` — detección automática de gaps documentales, recomendación de briefs, proyección 30/60/90d, extrapolación patrones; invocable desde orchestrator

### 10. INTEGRACIÓN CON BRIEF-DETECTOR-RECOMMENDER

El orchestrator puede invocar el detector de briefs como parte del ciclo de mejora continua:

```bash
# Desde orchestrator (vía terminal tool o script)
node scripts/brief-detector-recommender.cjs full-cycle
```

**Flujo de integración:**

1. **Trigger**: Tras cada asimilación de repo, o semanal via cron, o cuando usuario pide "¿qué briefs faltan?"
2. **Ejecución**: `full-cycle` genera 4 reportes en `docs/`:
   - `brief-detection-report.json` — gaps estructurados
   - `brief-recommendations.md` — priorizados P0/P1/P2
   - `brief-projection-30-60-90.md` — horizonte temporal
   - `brief-extrapolation.md` — patrones + predicción próximos repos
3. **Consumo por orchestrator**:
   - Parse `brief-detection-report.json` → actualiza `orchestrator-state.json` con nuevos tasks
   - Lee `brief-recommendations.md` → presenta al usuario en menú interactivo
   - Añade tasks `BRIEF-create-<ID>` al workstream `DOCUMENTATION`
4. **Task recurrente sugerida**:
```json
{
  "id": "BRIEF-detector-cycle",
  "title": "Ejecutar brief-detector-recommender full-cycle (semanal)",
  "deps": [],
  "effort": 1,
  "value": 85,
  "workstream": "DOCUMENTATION",
  "source": "agent",
  "priority": 80,
  "recurring": "weekly",
  "blocks": [],
  "status": "pending",
  "notes": "Actualiza BRIEFS_INDEX.md, detecta gaps, recomienda próximos briefs"
}
```

**Pitfall:** Los reportes son markdown/JSON parseables — no depender de formato visual, usar estructura consistente.

---

### 12. RECOMENDACIONES DE TAREAS (Sugerencias del Agente)

Cuando el usuario pida recomendaciones o "qué sigue", el agente debe evaluar el contexto y sugerir tareas de los workstreams pendientes. Las tareas se guardan en `orchestrator-state.json` con `source: "agent"`:

#### Prioridad P0 (Completar primero — desbloquea otros workstreams):

| ID | Tarea | Workstream | Esfuerzo | Valor |
|----|-------|------------|----------|-------|
| `NC-fix-types` | Corregir type mismatch en nextcloud (re-exportar tipos) | NEXTCLOUD | 1 | 95 |
| `NC-build-verify` | Build OK + push main (nextcloud asimilado) | NEXTCLOUD | 1 | 90 |
| `VAULT-lucidez_material` | Implementar lib/lucidez_material.ts (Pirámide 4 niveles MJ) | VAULT_MODULES | 2 | 90 |
| `VAULT-autovividasis` | Implementar lib/autovividasis.ts (chequeo vivido vs calculado) | VAULT_MODULES | 2 | 88 |

#### Prioridad P1 (Alta — módulos del vault):

| ID | Tarea | Workstream | Esfuerzo | Valor |
|----|-------|------------|----------|-------|
| `VAULT-plan90` | Implementar lib/plan_90_dias.ts (3 ciclos lunares) | VAULT_MODULES | 2 | 88 |
| `VAULT-urbion` | Implementar lib/urbion.ts (Ontogénesis Urbana) | VAULT_MODULES | 2 | 85 |
| `VAULT-fases` | Implementar lib/fases.ts (Fases 0→E + hard gates) | VAULT_MODULES | 2 | 85 |
| `VAULT-karatani` | Implementar lib/karatani.ts (Modos A/B/C/D) | VAULT_MODULES | 1 | 82 |

#### Prioridad P2 (Media — documentación post-asimilación):

| ID | Tarea | Workstream | Esfuerzo | Valor |
|----|-------|------------|----------|-------|
| `NC-brief-update` | Actualizar BRIEF_EXHAUSTIVO con Nextcloud (Sección 20) | NEXTCLOUD | 1 | 85 |
| `NC-readme-update` | Actualizar README.md con /nextcloud en Pantallas Clave | NEXTCLOUD | 1 | 80 |

#### Prioridad P3 (Normal — mejoras continuas):

| ID | Tarea | Workstream | Esfuerzo | Valor |
|----|-------|------------|----------|-------|
| `P0-netbenefit` | Crear lib/netbenefit.ts (Motor BN 8 escalas) | P0_SPECS | 3 | 95 |
| `P0-cds_jurados` | Crear lib/cds_jurados.ts (Jury summon, weights) | P0_SPECS | 3 | 90 |
| `P0-copiosis` | Crear lib/copiosis.ts (NetBenefitFlow, GoodType) | P0_SPECS | 2 | 88 |
| `P0-valueflows` | Extender ValueFlows types | P0_SPECS | 1 | 85 |
| `DEPLOY-link` | Vercel link + env vars + deploy prod | DEPLOY | 2 | 95 |
| `DEPLOY-verify` | Verificar rutas 200 + CoachFAB visible | DEPLOY | 1 | 90 |
| `DEPLOY-auto` | Configurar auto-deploy on push | DEPLOY | 1 | 85 |

#### Cómo proponer tareas al usuario:

1. **Contexto:** Workstreams activos + tareas completadas/ora
2. **Tareas sugeridas:** Mostrar 3-5 tareas ordenadas por score (valor/esfuerzo)
3. **Preguntar:** *"¿Quieres que guarde esta tarea en el orchestrator?"* (regla de comportamiento)
4. **Guardar:** Si el usuario confirma, añadir a `orchestrator-state.json` con `source: "agent"`
5. **Ejecutar:** Si el usuario elige una tarea, seguirla según el procedimiento del workstream

#### Workstreams disponibles para recomendación:

| Workstream | Descripción | Tareas pendientes |
|------------|-------------|-------------------|
| `P0_SPECS` | Especificaciones fundacionales (netbenefit, cds_jurados, copiosis) | 4 |
| `MIGRATION` | 11 módulos DeseOS (P1→P11) | 11 |
| `COACH` | Integración Autómata + BranDNA + Lucidez | 4 |
| `ROLES` | Mapeo DeseOS→Coworkers | 3 |
| `DEPLOY` | Vercel link + verify + auto-deploy | 3 |
| `VAULT_MODULES` | 7 módulos TypeScript del vault Obsidian | 6 |
| `NEXTCLOUD` | Asimilación Nextcloud Server | 4 |
| `DOCUMENTATION` | Briefs, detección de gaps | 1 (recurring) |

---

### 11. PITFALLS (Actualizados)