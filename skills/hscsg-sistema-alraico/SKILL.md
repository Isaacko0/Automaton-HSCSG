---
name: hscsg-sistema-alraico
description: >-
  Kernel de orquestación del Sistema Alráico en HSCSG v15 OS: ejecuta loops de reconfiguración,
  detecta sobrecargas (ΣPᵢ > κ), dispara γ-CARMIS (reconfiguración ante ruptura) y detecta
  resonancia entre módulos (αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂). Anfibio: offline (RAO local) ↔ conectado
  (Nostr/NEAR). Usar cuando el usuario pida "correr el motor", "simular Alráico", "detectar
  sobrecarga", "disparar γ-CARMIS", "ver resonancia", o operar el orquestador en /simulador.
license: MIT
author: HSCSG + Hermes Agent (extraído de src/core/lib/loopEngine.ts + Sistema-Alraico-loop-engineering-skill)
metadata:
  hermes:
    tags: [hscsg, alraico, loop-engine, gamma-carmis, resonancia, sobrecarga, simulador, soberania]
    related_skills: [hscsg-coeficiente-autonomia, hscsg-unified-assimilation-science, Sistema-Alraico-loop-engineering-skill]
---

# HSCSG v15 OS — Sistema Alráico (Kernel de Orquestación)

Skill dedicada al motor nativo de reconfiguración del nodo. Extrae y operationaliza
`src/core/lib/loopEngine.ts` + la epistemología de `Sistema-Alraico-loop-engineering-skill`
(γ-CARMIS, 20 límites cognitivos, ECROx, triaxial).

> **Principio:** El motor no es decoración. Cada tick ejecuta 6 loops + γ-CARMIS + resonancia
> sobre el `AppState` real. Si `detectOverloads` ve sobrecarga ANTES de los loops de reparación,
> γ-CARMIS reconfigura (no repara lo roto, reorganiza).

---

## 1. APIs del motor (loopEngine.ts)

```typescript
import {
  runAlraicoTick,
  runAlraicoSimulation,
  detectOverloads,
  detectResonances,
  DEFAULT_LOOP_CONFIG,
} from '@core/lib/loopEngine'
import type { AppState } from '@core/state/store'

// Un tick completo: 6 loops + γ-CARMIS + resonancia
const { state, results } = runAlraicoTick(appState)

// Detecta ΣPᵢ > κ en cada módulo (𝕮)
const overloads = detectOverloads(appState)
//   → lucidez (Ley III), symbiosky (propuestas sin result), agentMesh (idle),
//     proofOfResponse (expired), regen (ecotech sin sistema)

// Reconfiguración γ-CARMIS
const delta = simulateReconfig(overloads, appState)
//   → enciende lucidez, activa agentes, resuelve expirados

// Resonancia entre módulos
const res = detectResonances(appState)
//   → αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂  ⇒  sinergia disparada
```

---

## 2. Orden crítico (pitfall conocido)

**γ-CARMIS debe detectar sobrecargas ANTES de los loops de reparación.**
Si se repara primero (ej. `cdsDecayLoop` enciende lucidez), `detectOverloads` ya no ve la
sobrecarga y γ-CARMIS no dispara. En `runAlraicoTick` el orden es:

```
1. detectOverloads(st)        ← ANTES de reparar
2. if overloads → simulateReconfig (γ-CARMIS)
3. run 6 loops (cds, symbio, agent, por, regen, audit)
4. detectResonances(st)
```

**Test estable:** `loopEngine.test.ts` valida `gammaCARMIS` con `lucidez=false` inicial
(sobrecarga detectada → γ-CARMIS la enciende). 7/7 tests.

---

## 3. Configuración

```typescript
DEFAULT_LOOP_CONFIG = {
  tickIntervalMs: 1000,
  maxTicks: 1000,
  resonanceThreshold: 0.8,
  enableAgentSpawn: true,
  enableSkillExecution: true,
}
```

`enableSkillExecution: true` → el motor puede invocar skills hermanas (ver skill maestra
`hscsg-unified-assimilation-science`) cuando un módulo requiere reparación especializada.

---

## 4. Mapeo a epistemología Alráica (de Sistema-Alraico-loop-engineering-skill)

| Concepto loopEngine | Origen Alráico |
|---|---|
| Sobrecarga ΣPᵢ > κ | y-CARMIS: Overload → Threshold → Rupture → Reorg → Stable |
| γ-CARMIS (simulateReconfig) | Reorganización tras ruptura (no parche) |
| Resonancia αʰ | ECROx: configuración relacional dinámica |
| Lucidez off = sobrecarga | Límite L? / Ley III MJ (auditar con sensores) |
| Agentes idle (rep=0) | 20 límites cognitivos: identidad fusionada / patrones viejos |

Variables del motor (análogas a las del canvas Alráico):
`al` (armonía), `s` (sincronía), `y` (ligadura/realidad), `v` (estibación/rigidez),
`XP_i` (carga), `k` (umbral). Medir 1–10 ÷ 10 → 0.0–1.0.

---

## 5. /simulador (UI en vivo)

`src/app/screens/Simulador.tsx` expone el motor: sliders Ω/s/κ, proyección αʰ(t),
sobrecargas y resonancias en vivo. Usa `AppState` mínimo casteado (no `SimState` inventado).

---

## 6. Vasos comunicantes

- `[EBD-D1]` ADSOA nativo ← `docs/research_output/04_...`
- `[DV-01]` validación estratégica ← `docs/research_output/06_...`
- Código: `src/core/lib/loopEngine.ts` + `src/core/lib/loopEngine.test.ts`
- UI: `src/app/screens/Simulador.tsx`
- Skills hermanas: `hscsg-coeficiente-autonomia` (AUT/CDS alimenta sobrecargas),
  `hscsg-unified-assimilation-science` (orquesta el motor)

---

## 7. Cuándo usar esta skill

- "Corre el motor Alráico" / "simula un tick"
- "Detecta sobrecargas en el nodo"
- "Dispara γ-CARMIS"
- "Ver resonancia entre módulos"
- "Por qué el agente X está inactivo" (reputation=0 → sobrecarga agentMesh)
