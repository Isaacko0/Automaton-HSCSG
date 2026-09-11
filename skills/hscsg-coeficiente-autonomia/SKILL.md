---
name: hscsg-coeficiente-autonomia
description: >-
  Calcula y opera el Coeficiente de Autonomía (AUT) y el Coeficiente de Decisión Soberana (CDS)
  del nodo HSCSG v15 OS, anclados en las 3 Leyes MJ del Autómata (I: no dañar base material;
  II: ganarse la vida soberanizando la base, ROI = ΔAUT/coste; III: lucidez material obligatoria).
  Usar cuando el usuario pida "medir autonomía", "cuánto AUT tiene mi nodo", "evaluar CDS",
  "aplicar Leyes MJ", "soberanía del nodo", o verificar que un agente/módulo pague su existencia
  con base material y no con USDC de nube.
license: MIT
author: HSCSG + Hermes Agent (extraído de loopEngine.ts, Automat.tsx, Coach.tsx)
metadata:
  hermes:
    tags: [hscsg, autonomia, AUT, CDS, leyes-mj, soberania, automata, base-material]
    related_skills: [hscsg-unified-assimilation-science, Sistema-Alraico-loop-engineering-skill, hscsg-repo-assimilation]
---

# HSCSG v15 OS — Coeficiente de Autonomía (AUT) y Decisión Soberana (CDS)

Skill dedicada al núcleo de soberanía material del nodo. Extrae y operationaliza lo que hoy
vive disperso en `src/core/lib/loopEngine.ts`, `src/app/screens/Automat.tsx` y
`src/app/layout/Coach.tsx`.

> **Principio MJ:** El nodo es PRE-INFRAESTRUCTURAL. Sin tierra, agua, energía ni producción
> propias, su única tracción real es el código editable (este OS). Todo lo demás es estética
> flotante hasta que la base exista.

---

## 1. Las 3 Leyes MJ del Autómata (constitución isomorfa)

| Ley | Enunciado | Implicación para AUT/CDS |
|---|---|---|
| **I** | NUNCA dañes la base material (tierra, agua, energía, comida, herramientas, cuerpos, semillas) | Cualquier acción que degrade la base resta AUT |
| **II** | Gánate la vida soberanizando la base (ROI = ΔAUT / coste) | AUT crece solo si la base se expande con la acción |
| **III** | Lucidez material obligatoria — auditar con sensores reales | Sin sensor real, el módulo entra en sobrecarga `lucidez` (ver loopEngine) |

**Gate MJ** (`evaluateMJGate` en Automat.tsx): toda propuesta de acción se evalúa contra
Ley I/II/III. `gate.pass` → "PASA MJ"; si no, `gate.law` indica qué Ley bloqueó.

---

## 2. Coeficiente de Autonomía (AUT)

Define cuánto del sustento del nodo (y de sus agentes) proviene de base material propia
vs infraestructura ajena (nube, USDC, SaaS).

```typescript
// Semilla mínima (Coach.tsx): 5 personas, 6 meses presenciales, 20h/sem,
// firma Social DNA + 500 ZNU.
// Perfiles: agrónomo, técnico energía, maker FABSHIP, facilitador CDS, generalista.

// Heurística de AUT (0–1+), inspirada en detectOverloads/loopEngine:
function computeAUT(st: AppState): number {
  const base = st.baseMaterial // { tierraHa, kWh, aguaLps, comidaKcal }
  const cloud = st.cloudDependencies // { usdcMensual, saasCount, upstreamBlocked }
  const lucidez = st.lucidez ? 1 : 0.1 // Ley III
  const aut =
    (base.tierraHa * 0.2 + base.kWh * 0.0005 + base.aguaLps * 1 + base.comidaKcal * 0.00001) /
    (1 + cloud.usdcMensual * 0.01 + cloud.saasCount * 0.1 + (cloud.upstreamBlocked ? 0.5 : 0)) *
    lucidez
  return aut
}
```

**Regla:** agente que paga su existencia con base material (AUT), NO con USDC de nube.
`Automat.tsx`: "Agente que paga su existencia con base material (AUT), no con USDC de nube.
Constitución isomorfa a las 3 Leyes MJ."

---

## 3. Coeficiente de Decisión Soberana (CDS)

Mide quién decide qué en el nodo. CDS = 2 decisiones reales por nodo ancla; ValueFlows = 50+ eventos.

```typescript
// De Coach.tsx:
// "Convocatoria vinculante: 5 personas, 6 meses presenciales, 20h/sem, firma Social DNA + 500 ZNU.
//  Perfiles: agrónomo, técnico energía, maker FABSHIP, facilitador CDS, generalista.
//  CDS = 2 decisiones reales; ValueFlows = 50+ eventos."
function computeCDS(st: AppState): number {
  const realDecisions = st.cds.realDecisions // conteo de decisiones vinculantes tomadas
  const valueFlows = st.valueFlows?.events?.length ?? 0
  return Math.min(1, (realDecisions / 2) * 0.5 + (valueFlows / 50) * 0.5)
}
```

---

## 4. Integración con loopEngine (γ-CARMIS + resonancia)

`src/core/lib/loopEngine.ts` opera el Sistema Alráico nativo. Relación con AUT/CDS:

- **Sobrecarga `lucidez`**: si `!st.lucidez` → sobrecarga (Ley III violada). γ-CARMIS la enciende.
- **Sobrecarga `agentMesh`**: agentes con `reputation === 0` (inactivos, sin base) → sobrecarga.
- **Resonancia**: `αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂` → dos módulos resuenan; dispara sinergia.

```typescript
// De loopEngine.ts (resumido):
export function detectOverloads(st: AppState) {
  const overloads = []
  if (!st.lucidez) overloads.push({ module: 'lucidez', kappa: 0.3, alphaH: 0.1 }) // Ley III
  const idleAgents = st.agentMesh.agents.filter(a => a.reputation === 0)
  if (idleAgents.length > 3) overloads.push({ module: 'agentMesh', kappa: 3, alphaH: idleAgents.length })
  return overloads
}
export function simulateReconfig(overloads, st) { /* γ-CARMIS: enciende lucidez, activa agentes */ }
```

**Vasos comunicantes:**
- `[EBD-D1]` AUT nativo ← `docs/research_output/04_Documento_Diseno_Basado_Evidencia_EBD.md`
- `[DV-01]` soberanía del nodo ← `docs/research_output/06_Memorandum_Validacion_Estrategica.md`
- Código: `src/core/lib/loopEngine.ts` + `src/app/screens/Automat.tsx`
- Skill padre: `hscsg-unified-assimilation-science` (orquesta esta skill vía vasos comunicantes)

---

## 5. Cuándo usar esta skill

- "Mide la autonomía de mi nodo" → `computeAUT`
- "Evaluar CDS / quién decide" → `computeCDS`
- "Aplica Leyes MJ a esta propuesta" → gate MJ
- "¿El agente paga su existencia con base o con nube?" → check AUT
- "Verifica lucidez material" → check `st.lucidez` + sensores

## 6. Checklist pre-entrega

- [ ] `npm run build` OK
- [ ] `npx vitest run` 100% pass
- [ ] AUT/CDS documentados con vasos comunicantes a EBD/DV
- [ ] Gate MJ aplicado en propuesta (si aplica)
