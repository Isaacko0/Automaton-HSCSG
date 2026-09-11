---
name: hscsg-orquestador-skills
description: >-
  Skill maestra orquestadora de HSCSG v15 OS. Actúa como ROUTER entre las 9 skills propias:
  detecta la intención del usuario y despacha a la skill correcta (o combina varias vía vasos
  comunicantes). Cubre asimilación de repos, protocolo científico (EBD), Sistema Alráico
  (loopEngine/γ-CARMIS), Coeficiente de Autonomía (AUT/CDS/Leyes MJ), monetary-integration,
  document-architect, multi-framework-integration, repo-assimilation y unified-assimilation-science.
  Garantiza que TODA fuente externa se asimile como módulo vivo Y documento trazable, y que el
  motor Alráico y la soberanía del nodo operen con vasos comunicantes cruzados.
license: MIT
author: HSCSG + Hermes Agent
metadata:
  hermes:
    tags: [hscsg, orquestador, router-skills, vasos-comunicantes, asimilacion, ciencia, alraico, autonomia]
    related_skills:
      - hscsg-repo-assimilation
      - hscsg-scientific-papers
      - hscsg-unified-assimilation-science
      - hscsg-sistema-alraico
      - hscsg-coeficiente-autonomia
      - hscsg-monetary-integration
      - hscsg-document-architect
      - hscsg-multi-framework-integration
      - Sistema-Alraico-loop-engineering-skill
---

# HSCSG v15 OS — Orquestador de Skills (Router + Vasos Comunicantes)

Skill maestra que **enruta y conecta** las 9 skills propias de HSCSG. No reemplaza a las
otras: las **invoca** cuando su dominio aplica, y mantiene **vasos comunicantes** (trazabilidad
cruzada evidencia → decisión → código → test → skill → paper).

> **Regla de oro:** Ninguna skill opera en aislamiento. Cada tarea pasa por este router, que
> decide (a) qué skill(s) cargar y (b) qué vasos comunicantes abrir entre ellas.

---

## 1. Catálogo de Skills Propias (9)

| # | Skill | Dominio | Cuándo invocarla |
|---|---|---|---|
| 1 | `hscsg-repo-assimilation` | Asimilar repo externo como módulo vivo (4 fases) | "asimilar <repo>", "integrar código de <fuente>" |
| 2 | `hscsg-scientific-papers` | Protocolo papers (EBD, vasos comunicantes) | "generar paper/white paper/brief científico" |
| 3 | `hscsg-unified-assimilation-science` | Fusión asimilación + ciencia (maestra base) | tarea mixta repo+paper, o fallback metodológico |
| 4 | `hscsg-sistema-alraico` | Kernel loopEngine: γ-CARMIS, resonancia, sobrecargas | "correr motor", "simular Alráico", "disparar γ-CARMIS" |
| 5 | `hscsg-coeficiente-autonomia` | AUT, CDS, 3 Leyes MJ, soberanía del nodo | "medir autonomía", "evaluar CDS", "aplicar Leyes MJ" |
| 6 | `hscsg-monetary-integration` | Sistemas monetarios alt. (G1, Túmin, PAR, ZCS/ZNU) | "integrar moneda X", "arquitectura monetaria" |
| 7 | `hscsg-document-architect` | Documentos fundacionales unificados (BRIEF, modelo) | "documento exhaustivo", "modelo civilizatorio" |
| 8 | `hscsg-multi-framework-integration` | Multi-framework (DisCO, 8 Capitales, Integral) | "integrar marco X en doc base" |
| 9 | `Sistema-Alraico-loop-engineering-skill` (`loop-engineering-canvas`) | Canvas epistémico universal (20 límites, ECROx, triaxial) | "diagnosticar problema estancado", "canvas de bucles" |

---

## 2. Lógica de Enrutamiento (Router)

```
INTENCIÓN DEL USUARIO
       │
       ├─ "asimilar repo / integrar código" ──────────────► hscsg-repo-assimilation
       │                                                    (+ unified si hay paper)
       ├─ "paper / white paper / brief científico" ───────► hscsg-scientific-papers
       │                                                    (+ unified para vasos)
       ├─ "correr motor / γ-CARMIS / resonancia" ─────────► hscsg-sistema-alraico
       │                                                    (+ coeficiente-autonomia: overloads↔AUT)
       ├─ "medir AUT / CDS / Leyes MJ" ──────────────────► hscsg-coeficiente-autonomia
       ├─ "moneda / ZCS / ZNU / G1 / Túmin" ─────────────► hscsg-monetary-integration
       ├─ "documento exhaustivo / modelo civilizatorio" ──► hscsg-document-architect
       ├─ "integrar marco (DisCO/Integral/8 Cap)" ────────► hscsg-multi-framework-integration
       ├─ "problema estancado / diagnosticar bucles" ─────► Sistema-Alraico-loop-engineering-skill
       └─ tarea mixta / ambigua ──────────────────────────► hscsg-unified-assimilation-science
                                                            (que a su vez invoca las específicas)
```

**Combinaciones frecuentes (vasos comunicantes abiertos):**
- Asimilar repo **+** documentar paper → `repo-assimilation` → `scientific-papers` (vaso: módulo↔EBD)
- Correr motor **+** medir soberanía → `sistema-alraico` ↔ `coeficiente-autonomia` (vaso: overloads lucidez↔Ley III)
- Monetary **+** documento → `monetary-integration` → `document-architect` (vaso: ZCS/ZNU↔arquitectura)

---

## 3. Vasos Comunicantes Obligatorios (Cross-Skill)

Cada skill debe citar a las hermanas cuando su salida dependa de ellas:

| Contexto | Formato de cita | Ejemplo |
|---|---|---|
| Módulo asimilado | `[repo:<nombre>]` | `hscsg-repo-assimilation` |
| Decisión EBD | `[EBD-D#]` | `hscsg-scientific-papers` / `unified` |
| Motor/γ-CARMIS | `[alraico:loopEngine]` | `hscsg-sistema-alraico` |
| AUT/CDS/MJ | `[aut:CDS]` / `[mj:LeyIII]` | `hscsg-coeficiente-autonomia` |
| Moneda | `[mon:G1]` / `[mon:ZNU]` | `hscsg-monetary-integration` |
| Doc fundacional | `[doc:BRIEF§2]` | `hscsg-document-architect` |
| Marco | `[mf:DisCO]` | `hscsg-multi-framework-integration` |
| Canvas | `[canvas:20limites]` | `Sistema-Alraico-loop-engineering-skill` |

---

## 4. Flujo Estándar del Orquestador

```
1. IDENTIFICAR intención → tabla §1
2. CARGAR skill(s) específica(s) vía skill_view(name)
3. ABRIR vasos comunicantes (citas cruzadas obligatorias)
4. EJECUTAR tarea en skill hija
5. VERIFICAR (build + tests + vasos) — ver unified-assimilation-science FASE 4
6. COMMIT + PUSH + TAG (trazabilidad: EBD, DV, KPI, refs)
7. DISPARAR SYNC (vasos comunicantes al día) — ver §8
```

---

## 8. Mantenimiento de Vasos Comunicantes (Sync Periódico)

El orquestador **dispara y asegura** el cron de sincronización que mantiene README/BRIEF/CHANGELOG
y las skills propias al día con el estado real del repo. Esto es obligatorio para no romper los
vasos comunicantes entre skills.

### Al cargar esta skill, el orquestador debe:

**A) Ejecutar el sync inmediatamente (mantenimiento):**

```bash
bash "/c/Users/Isaacko0/Documents/HSCSG_v15_OS/scripts/sync_docs.sh"
```

El script: cuenta rutas reales en `App.tsx`, skills, docs científicos; verifica `npm run build`;
re-espeja `skills/hscsg-*` al índice de Hermes (`~/.hermes/skills/hscsg/`); y auto-commitea/pushea
cambios en `docs/` o `skills/`.

**B) Asegurar que el cron esté programado (idempotente):**

```bash
# Verificar existencia del cron 'HSCSG sync docs (vasos comunicantes)'
cronjob(action="list")
# Si NO existe, crearlo:
cronjob(action="create",
  name="HSCSG sync docs (vasos comunicantes)",
  schedule="0 3 * * 0",            # domingos 03:00
  skills=["hscsg-orquestador-skills"],   # carga el router, que a su vez corre sync_docs.sh
  prompt="Ejecuta el orquestador HSCSG: corre scripts/sync_docs.sh (re-espeja skills propias al indice Hermes, cuenta rutas/docs, verifica build, auto-commitea docs/skills). Reporta conteos y estado. Si build falla, NO commitees y avisa.",
  repeat="forever")
```

> **Idempotencia:** si el cron ya existe (job_id `23ec7972c64e`), no recrearlo — solo confirmar
> que está `enabled: true`. El orquestador puede invocarlo manualmente con `cronjob(action="run", job_id="23ec7972c64e")`
> cuando el usuario pida "sincroniza ahora" o tras una asimilación grande.

### Cuándo disparar el sync
- Al final de cualquier tarea de asimilación/creación de skill (paso 7 arriba).
- Cuando el usuario pida "mantén vasos comunicantes al día" / "sincroniza".
- Periódicamente vía el cron (domingos) — no requiere acción manual.

---

## 5. Cómo invocar skills hermanas (desde esta skill)

```bash
# En Hermes, cargar la skill específica ANTES de actuar:
skill_view(name="hscsg-sistema-alraico")
skill_view(name="hscsg-coeficiente-autonomia")
# ... etc según tabla §1
```

Si el nombre es ambiguo (ej. `hscsg-monetary-integration` existe en `business-strategy/` y
`hscsg/`), usar ruta completa: `skill_view(name="hscsg/hscsg-monetary-integration")`.

---

## 6. Checklist del Orquestador

- [ ] Intención mapeada a skill(s) en tabla §1
- [ ] Skills cargadas vía `skill_view`
- [ ] Vasos comunicantes citados (formato §3)
- [ ] Tarea ejecutada en skill hija
- [ ] Build + tests OK
- [ ] Commit + push + tag con trazabilidad

---

## 7. Referencias

- `skills/OUR_SKILLS.md` — manifest de diferenciación vs instalación
- `skills/hscsg-unified-assimilation-science/SKILL.md` — metodología base (5 fases)
- `src/core/lib/loopEngine.ts` — motor Alráico nativo
- `docs/research_output/04_Documento_Diseno_Basado_Evidencia_EBD.md` — decisiones EBD
