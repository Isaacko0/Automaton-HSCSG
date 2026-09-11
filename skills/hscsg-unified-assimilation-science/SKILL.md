---
name: hscsg-unified-assimilation-science
description: Skill unificada maestra para HSCSG v15 OS que fusiona: (1) asimilación de repos externos como módulos vivos (4 fases obligatorias) + (2) protocolo científico para papers/documentos técnicos (EBD, vasos comunicantes, reproducibilidad). Fusiona hscsg-repo-assimilation + hscsg-scientific-papers. Garantiza que TODA fuente externa (repo, paper, spec, specificación) se asimile como módulo vivo Y genere documentación trazable con vasos comunicantes cross-repo, EBD, reproducibilidad y vasos comunicantes cross-repo en todo HSCSG v15 OS.
---

# HSCSG v15 OS — Skill Unificada: Asimilación + Ciencia (Vasos Comunicantes Totales)

## Propósito Unificado

Esta skill fusiona **dos capacidades críticas** en una sola metodología coherente:

1. **ASIMILACIÓN** — Convertir cualquier repo externo (Solidity, Laravel, JSON-schemas, Rust, Go, etc.) en un **módulo vivo** de HSCSG v15 OS (pantalla + estado + lógica pura + nav + tests), extirpando infraestructura ajena y conservando lógica isomórfica a Leyes I/II/III + CaaS.

2. **CIENCIA** — Generar papers, technical reports, white papers, EBDs, briefs científicos, memorándums, informes de factibilidad y protocolos de comunicación con **rigor metodológico EBD**, **trazabilidad total** (evidencia → decisión → módulo → test → paper), **reproducibilidad**, **acceso abierto** y **vasos comunicantes** cross-repo en TODO el ecosistema HSCSG.

**Principio Rector:** *Ninguna fuente entra sin convertirse en módulo vivo Y documento trazable. Ningún documento existe en aislamiento. Cada claim tiene su vaso comunicante hacia evidencia, código, test y decisión.*

---

## Estructura Canónica Unificada (Asimilación + Ciencia)

```
HSCSG_v15_OS/
├── src/
│   ├── app/
│   │   ├── screens/<Modulo>.tsx          # 1 pantalla por módulo asimilado
│   │   ├── App.tsx                       # rutas
│   │   └── layout/Aside.tsx              # nav (iconos lucide)
│   ├── core/
│   │   ├── state/
│   │   │   ├── <modulo>.ts               # tipos + estado inicial (makeXState)
│   │   │   ├── store.ts                  # store global (importa tipos/lib/acciones)
│   │   │   └── ads/                      # NUEVO: módulos ADS nativos (ACP, DF, CC, UV-PKI, etc.)
│   │   └── lib/
│   │       ├── <modulo>.ts               # lógica PURA (makeXState, helpers)
│   │       └── ads/                      # NUEVO: lógica ADS pura
│   └── components/ui.tsx                 # Card, Stat, Btn, Badge, EmptyState, Field, Bar
├── docs/
│   ├── research_output/                  # NUEVO: 8 documentos científicos base
│   │   ├── 01_Propuesta_Investigacion_Aplicada_ADSOA_HSCSG.md
│   │   ├── 02_Brief_Estrategico_Basado_Evidencia_ADSOA.md
│   │   ├── 03_White_Paper_Estrategia_ADSOA_HSCSG.md
│   │   ├── 04_Documento_Diseno_Basado_Evidencia_EBD.md
│   │   ├── 05_Brief_Cientifico_ADSOA_HSCSG.md
│   │   ├── 06_Memorandum_Validacion_Estrategica.md
│   │   ├── 07_Informe_Factibilidad_Metodologica.md
│   │   └── 08_Protocolo_Comunicacion_Cientifica.md
│   ├── <repo>_backup.md                  # Qué es el repo original (Fase 2 asimilación)
│   ├── <repo>_integration.md             # Triple perspectiva Usuario/LLM/HSCSG (Fase 2)
│   ├── negative_results/                 # Resultados negativos documentados
│   ├── postmortems/                      # Post-mortems de riesgos materializados
│   ├── diagrams/                         # Mermaid .mmd para papers
│   └── impact_report_QX_YYYY.md          # Métricas impacto trimestrales
├── data/
│   ├── raw/                              # Datos crudos (benchmarks, chaos logs)
│   ├── processed/                        # Datos agregados, stats
│   ├── simulations/                      # Monte Carlo, parameter sweeps
│   └── tables/                           # CSV source para tablas papers
├── scripts/
│   ├── figures/                          # Generación figuras para papers
│   └── benchmark/                        # Scripts reproducibilidad
├── skills/
│   ├── hscsg-unified-assimilation-science/SKILL.md  # ESTA SKILL (maestra)
│   ├── hscsg-repo-assimilation/          # Skill legacy (referencia)
│   └── hscsg-scientific-papers/          # Skill legacy (referencia)
└── skills/hscsg-repo-assimilation/references/
    └── hscsg-architecture.md             # Patrones arquitectura HSCSG (Modo Lucidez, etc.)
```

---

## Metodología Unificada: 5 Fases Obligatorias (En Orden)

### FASE 0 — Respaldo PRIMERO (Siempre)
```bash
cd /c/Users/Isaacko0/Documents
cp -r HSCSG_v15_OS HSCSG_v15_OS_BACKUP_$(date +%Y%m%d_%H%M%S)
rm -rf HSCSG_v15_OS_BACKUP_*/node_modules HSCSG_v15_OS_BACKUP_*/dist
du -sh HSCSG_v15_OS_BACKUP_*/ | head -1  # ~2M sin node_modules
```

### FASE 1 — Clonar + Documentar Fuente (Asimilación) O Leer 8 Docs Base (Ciencia)

**Para Asimilación (Repo Externo):**
```bash
cd /c/Users/Isaacko0/Documents
timeout 120 git clone --depth 1 https://github.com/<owner>/<repo>.git repo_<short>
# Verificar: git -C repo_xxx ls-files | wc -l  (debe ser >0)
```

**Para Ciencia (Nuevo Paper/Documento):**
```bash
# LEER OBLIGATORIAMENTE los 8 documentos base:
cat docs/research_output/01_Propuesta_Investigacion_Aplicada_ADSOA_HSCSG.md
cat docs/research_output/02_Brief_Estrategico_Basado_Evidencia_ADSOA.md
cat docs/research_output/03_White_Paper_Estrategia_ADSOA_HSCSG.md
cat docs/research_output/04_Documento_Diseno_Basado_Evidencia_EBD.md
cat docs/research_output/05_Brief_Cientifico_ADSOA_HSCSG.md
cat docs/research_output/06_Memorandum_Validacion_Estrategica.md
cat docs/research_output/07_Informe_Factibilidad_Metodologica.md
cat docs/research_output/08_Protocolo_Comunicacion_Cientifica.md
```

### FASE 2 — Documentar (Backup + Integración) O Diseñar (EBD + Vasos Comunicantes)

**Asimilación — Crear 2 documentos:**
1. `docs/<repo>_backup.md` — Qué es, stack, estructura, licencia
2. `docs/<repo>_integration.md` — Triple perspectiva:
   - **Usuario:** qué quiere lograr en su nodo
   - **LLM:** qué asimilar (lógica pura) y qué extirpar (infra ajena)
   - **HSCSG+CaaS:** isomorfismo con Leyes I/II/III + CaaS

**Ciencia — Aplicar EBD + Vasos Comunicantes:**
```
EVIDENCIA (8 docs + papers ADSOA + benchmarks)
    ↓
ANÁLISIS REQUISITOS (Gap Analysis → Decisiones D1-D8 / DV-01 a DV-04)
    ↓
DISEÑO SOLUCIÓN (Arquitectura, APIs, Protocolos + Vasos Comunicantes)
    ↓
PROTOTIPADO MVP (Módulo ADS / Test KPI)
    ↓
VALIDACIÓN CUANTITATIVA (Tests, Benchmarks, Chaos Engineering)
    ↓
ITERACIÓN O CONFIRMACIÓN (Go/No-Go por métricas)
    ↓
DOCUMENTACIÓN TRAZABLE (Paper/Report + Vasos Comunicantes)
```

**Decisiones EBD (D1-D8) — Plantilla Obligatoria en Todo Documento:**
| D# | Decisión | Evidencia Primaria | Módulo/Test Afectado |
|---|---|---|---|
| D1 | ADSOA nativo | Pérez-Leguizamo 2017: "not acceptable for mission critical" | ACP, DF, CC |
| D2 | ACP por entidad | ADS: "autonomous controllability" | ACP.ts |
| D3 | DF replicado | ADSOA 2017: "several processes intercommunicated" | DataField.ts |
| D4 | Content Code semántico | IEICE 2016: "identifies message with its content" | ContentCode.ts |
| D5 | UV-PKI propia | ADSOA 2017: "root-CA partitioned... uniqueness verified" | UV-PKI.ts |
| D6 | Folio Structure | ADSOA 2017: "Folio Structure identifies the transaction" | FolioStructure.ts |
| D7 | Autonomous Guard | ADS: "continue operating despite failure" | AutonomyGuard.ts |
| D8 | Coordination Protocol | ADSOA: "autonomous coordinability" | CoordinationProtocol.ts |

**Vasos Comunicantes Obligatorios (Citas Internas):**
| Contexto | Formato | Ejemplo |
|---|---|---|
| Decisión EBD | `[EBD-D1]` | Link a `04_Documento_Diseno_Basado_Evidencia_EBD.md#2` |
| Decisión Validación | `[DV-01]` | Link a `06_Memorandum_Validacion_Estrategica.md` |
| Test KPI | `[KPI-Availability]` | Link a test file + CI run |
| Código | `[src/core/state/ads/ACP.ts:L45-L60]` | Permalink GitHub |
| Dato Bruto | `[data/benchmark/latency_v20260818.csv]` | Zenodo DOI |
| Riesgo | `[R1]` | Link a Memorándum o Informe Factibilidad |

### FASE 3 — Módulo Real / Prototipo Mínimo + Tests KPI

**Asimilación (Por cada repo):**
1. **Tipos:** `src/core/state/<modulo>.ts` — interfaces dominio (sin deps externas)
2. **Lógica:** `src/core/lib/<modulo>.ts` — funciones puras (makeXState, helpers). NO importar infra original.
3. **Store:** `src/core/state/store.ts` — import tipos/lib, añadir a AppState, estado inicial, acciones (set), resetAll, partialize
4. **Pantalla:** `src/app/screens/<Modulo>.tsx` — icono lucide válido, UI components (Card, Stat, Btn, Badge, EmptyState, Field, Bar), inputs HTML crudos
5. **Nav + Ruta:** Aside.tsx (icono + item), App.tsx (import + Route)

**Ciencia / ADS Nativos — Módulos + Tests KPI:**
```typescript
// Estructura módulo ADS nativo (ej: ContentCode.ts)
src/core/state/ads/ContentCode.ts      # Tipos + taxonomía 12 CC + makeContentCodeState()
src/core/lib/ads/ContentCode.ts        # Lógica pura (routing, validation)
src/core/lib/ads/ContentCode.test.ts   # Tests KPI: routing accuracy 100%, latency < 5ms

// Tests KPI Obligatorios por Módulo ADS:
| Módulo | KPIs Mínimos |
|---|---|
| ContentCode | routing accuracy 100%, 0 misrouted |
| DataField | latency < 50ms, 3+ processes |
| ACP | filter accuracy 100%, 0 misrouted |
| AutonomyGuard | recovery < 2s, detection < 15s |
| FolioStructure | sequentiality 100%, sync < 5s |
| UV-PKI | auth success 100%, latency < 100ms |
| CoordinationProtocol | join < 500ms, sync < 5s |
```

### FASE 4 — Verificación Obligatoria ANTES de Entregar

```bash
cd /c/Users/Isaacko0/Documents/HSCSG_v15_OS

# 1. TypeScript strict
npx tsc --noEmit            # 0 errores (warnings @core son falsos positivos, ignorar)

# 2. Build producción
npm run build               # build OK

# 3. Preview + verificación rutas 200
pid=$(netstat -ano 2>/dev/null | grep ":4173 " | grep LISTEN | awk '{print $5}' | head -1)
[ -n "$pid" ] && taskkill /F /PID $pid
npm run preview &           # background; espera "Local: http://localhost:4173/"
for r in "" base lucidez caas symbiosky delegacion educacion soberania-credito regen vecinal nostr agentes verificacion simulador <nuevo-modulo>; do
  echo "/$r -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/$r)"
done                        # TODAS deben ser 200

# 4. Tests (incluyendo nuevos KPIs)
npx vitest run              # 100% pass

# 5. Para papers: verificación reproducibilidad
./scripts/benchmark/run_benchmark.sh  # Debe ejecutar sin errores
```

### FASE 5 — Commit, Push, Tag, Zenodo, Anuncio (Cierre Vasos Comunicantes)

```bash
# 1. Commit con trazabilidad completa
git add .
git commit -m "feat: <Modulo/Paper> (<repo>) + docs + tests

- EBD: [EBD-D1, EBD-D4]
- DV: [DV-01, DV-02]
- KPI: [KPI-Availability, KPI-RoutingAccuracy]
- Ref: #issue-number

Evidencia: docs/research_output/04_... + 06_... + tests + benchmarks"

# 2. Push
git push origin main

# 3. Tag versión (paper/doc)
git tag docs/v1.0-<nombre>

# 4. Zenodo Deposit (inmediato al tag) — SOLO papers/datasets
# - DOI + metadatos DataCite
# - Datos crudos en data/raw/, procesados en data/processed/
# - Scripts reproducción en scripts/

# 5. Anuncio + Tracking
# - GitHub Discussions + Twitter/LinkedIn + Mailing
# - Métricas en docs/impact_report_QX_YYYY.md
```

---

## Principio de Vasos Comunicantes Totales (Cross-Repo)

**Regla de Oro:** *Cada elemento en HSCSG tiene 4 conexiones trazables:*

```
EVIDENCIA (Papers ADSOA, Benchmarks, Post-mortems)
       ↕
DECISIÓN EBD (D1-D8) / VALIDACIÓN (DV-01 a DV-04)
       ↕
MÓDULO CÓDIGO (src/core/state/ads/ + src/core/lib/ads/)
       ↕
TEST KPI (Vitest + Chaos + Benchmark)
       ↕
PAPER/DOC (Zotero + Zenodo + GitHub)
       ↕
PRÓXIMA ITERACIÓN (Nueva hipótesis / nuevo repo)
```

**Implementación Práctica — Citas Internas Obligatorias:**
```markdown
# En CUALQUIER documento/paper/PR/issue:

## Decisión EBD
Ver decisión D1: adopción ADSOA nativa → [EBD-D1](docs/research_output/04_Documento_Diseno_Basado_Evidencia_EBD.md#2)

## Validación Estratégica
Decisión DV-01 aprobada → [DV-01](docs/research_output/06_Memorandum_Validacion_Estrategica.md#dv-01)

## KPI Target
Disponibilidad 99.99% → [KPI-Availability](src/core/lib/ads/AutonomyGuard.test.ts)

## Código Fuente
ACP filtering logic → [src/core/lib/ads/ACP.ts:L45-L60](src/core/lib/ads/ACP.ts#L45-L60)

## Dato Bruto
Benchmark latencia → [data/benchmark/latency_v20260818.csv](data/benchmark/latency_v20260818.csv) (Zenodo: 10.5281/zenodo.xxxxxx)

## Riesgo
R1: DF replication complexity → [R1](docs/research_output/06_Memorandum_Validacion_Estrategica.md#r1)

## Paper Resultado
White Paper ADSOA-HSCSG → [03_White_Paper_Estrategia_ADSOA_HSCSG.md](docs/research_output/03_White_Paper_Estrategia_ADSOA_HSCSG.md)
```

---

## Checklist Unificado Pre-Entrega (Asimilación + Ciencia)

### Para Asimilación de Repo:
- [ ] Backup creado (ruta + size reportado)
- [ ] Repo clonado + verificado (>0 archivos)
- [ ] `docs/<repo>_backup.md` + `<repo>_integration.md` creados (triple perspectiva)
- [ ] Módulo completo: tipos + lógica + store + pantalla + nav + ruta
- [ ] Isomorfismo Leyes I/II/III + CaaS documentado en integration.md
- [ ] `npx tsc --noEmit` → 0 errores
- [ ] `npm run build` → OK
- [ ] Preview: TODAS las rutas (incluyen nuevo módulo) = HTTP 200
- [ ] `npx vitest run` → 100% pass
- [ ] Commit + push + tag con mensaje trazable (EBD, DV, KPI, refs)

### Para Paper/Documento Científico:
- [ ] Leídos 8 documentos base (obligatorio)
- [ ] EBD aplicado: decisiones D1-D8 referenciadas con `[EBD-D#]`
- [ ] Validación DV-01 a DV-04 referenciada con `[DV-#]`
- [ ] KPIs cuantificables con tests en repo `[KPI-Name]`
- [ ] Vasos comunicantes: cada claim → evidencia → decisión → código → test → paper
- [ ] Citas primarias: ADSOA IEEE 2017 (DOI), IEICE 2016 (DOI), HSCSG docs
- [ ] Header estándar + versionado + DOI (si paper) + Git tag `docs/vX.Y`
- [ ] Internal Review (PI + 1 stakeholder, 5 días)
- [ ] Zenodo deposit (DOI + datos crudos + scripts reproducción)
- [ ] Git tag `docs/vX.Y` + anuncio + tracking métricas

---

## Pitfalls Unificados (Aprendidos en Esta Sesión)

| Categoría | Pitfall | Solución |
|---|---|---|
| **Lucide Icons** | TowerBroadcast, MasksTheater, Input, Textarea, Select NO existen | Usar Radio, Drama, HTML crudo |
| **Btn Component** | `size="sm"` rompe tsc | Quitar prop size |
| **Windows Paths** | git clone falla con .claude/skills/ (paths largos) | `git restore` arregla; ignorar assets con `:` |
| **TS Aliases** | `File not found @core/...` en linter inline | Falso positivo; `npx tsc --noEmit` real pasa |
| **Persist + Seed** | localStorage viejo oculta seed nuevo | Documentar: borrar key `hscsg.v15.os.v1` en DevTools |
| **CRLF Warnings** | git commit warnings en Windows | Inofensivos, ignorar |
| **Duplicados** | Usuario repite repo ya asimilado | Confirmar con usuario, no rehacer |
| **Credenciales** | Nunca incluir API keys/tokens | Redactar como `[REDACTED]` |
| **Vasos Rotos** | Paper sin citas `[EBD-D#]` o `[KPI-]` | Rechazar en review; obligatorio |
| **Datos Sin Zenodo** | Paper con benchmarks sin DOI | Rechazar; depositar Zenodo al tag |

---

## Referencias Rápidas (Archivos Clave)

| Archivo | Qué Contiene | Uso |
|---|---|---|
| `docs/research_output/01_Propuesta_Investigacion_Aplicada_ADSOA_HSCSG.md` | Plan 6 meses, fases, KPIs, presupuesto | Planificación Fase 1-3 |
| `docs/research_output/04_Documento_Diseno_Basado_Evidencia_EBD.md` | 8 decisiones D1-D8 + módulos + tests KPI | Referencia EBD obligatoria |
| `docs/research_output/06_Memorandum_Validacion_Estrategica.md` | 4 decisiones DV-01 a DV-04 + Go/No-Go | Validación estratégica |
| `docs/research_output/08_Protocolo_Comunicacion_Cientifica.md` | Estándares papers, datos, peer review | Estándares publicación |
| `skills/hscsg-repo-assimilation/references/hscsg-architecture.md` | Patrones arquitectura (Modo Lucidez, etc.) | Extender HSCSG |
| `src/core/state/store.ts` | Store global patrón | Referencia para nuevos módulos |
| `src/components/ui.tsx` | Componentes UI disponibles | Card, Stat, Btn, Badge, etc. |

---

## Commits y Tags Estándar (Trazabilidad Total)

```bash
# Commit mensaje convencional + trazabilidad
git commit -m "feat(ads): ContentCode.ts + taxonomía 12 CC + tests routing

- EBD: [EBD-D1, EBD-D4]
- DV: [DV-01, DV-02]
- KPI: [KPI-RoutingAccuracy, KPI-Latency]
- Refs: #42

Evidencia: docs/research_output/04_... + 06_... + tests + benchmarks"

# Tag para paper/doc científico
git tag docs/v1.0-adsoa-whitepaper

# Tag para módulo asimilado
git tag feat/v1.0-<modulo>
```

---

## Contacto y Escalación

| Rol | Nombre | Contacto | Disponibilidad |
|---|---|---|---|
| **PI / Skill Owner** | Isaac Ko (Isaacko0) | isaacko@protonmail.com / GitHub @Isaacko0 | L-V 9-18h UTC-6 |
| **Stakeholder Review** | [Nombre] | [Email] | Bi-semanal 30min |
| **Technical Reviewer** | [Nombre] | [Email] | Según necesidad |
| **Emergencia Seguridad** | PI | isaacko@protonmail.com (PGP: 0x...) | 24/7 |

---

**Document Control:** Version 1.0 | 2026-08-18 | Author: Isaac Ko | Classification: PUBLIC — COMMUNITY STANDARD | Status: ACTIVE | **Fusiona:** hscsg-repo-assimilation + hscsg-scientific-papers | **Principio:** Vasos Comunicantes Totales en HSCSG v15 OS