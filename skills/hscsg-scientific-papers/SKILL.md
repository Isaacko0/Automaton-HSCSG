---
name: hscsg-scientific-papers
description: Protocolo para generar papers científicos, technical reports, white papers y documentación técnica en HSCSG v15 OS. Basado en los 8 documentos científicos-estratégicos creados (Propuesta Investigación, Brief Estratégico, White Paper, EBD, Brief Científico, Memorándum Validación, Informe Factibilidad, Protocolo Comunicación). Garantiza rigor metodológico EBD, trazabilidad a evidencia ADSOA/HSCSG, reproducibilidad, acceso abierto y atribución correcta.
---

# HSCSG v15 OS — Protocolo de Papers Científicos y Documentación Técnica

## Fuentes Base (Los 8 Documentos Fundacionales)

| # | Documento | Archivo | Uso Principal |
|---|---|---|---|
| **1** | Propuesta de Investigación Aplicada | `01_Propuesta_Investigacion_Aplicada_ADSOA_HSCSG.md` | Plan de trabajo, fases, KPIs, presupuesto |
| **2** | Brief Estratégico Basado en Evidencia | `02_Brief_Estrategico_Basado_Evidencia_ADSOA.md` | Gap analysis, decisiones validadas, Go/No-Go |
| **3** | White Paper de Estrategia | `03_White_Paper_Estrategia_ADSOA_HSCSG.md` | Arquitectura objetivo, specs técnicas, roadmap |
| **4** | Documento de Diseño Basado en Evidencia (EBD) | `04_Documento_Diseno_Basado_Evidencia_EBD.md` | 8 decisiones D1-D8 → módulos → tests KPI |
| **5** | Brief Científico | `05_Brief_Cientifico_ADSOA_HSCSG.md` | Hipótesis H₁/H₀, metodología experimental, resultados |
| **6** | Memorándum de Validación Estratégica | `06_Memorandum_Validacion_Estrategica.md` | 4 decisiones DV-01 a DV-04 + criterios Go/No-Go |
| **7** | Informe de Factibilidad Metodológica | `07_Informe_Factibilidad_Metodologica.md` | Técnica/Operativa/Económica/Temporal + riesgos cuantificados |
| **8** | Protocolo de Comunicación Científica | `08_Protocolo_Comunicacion_Cientifica.md` | Estándares papers, datos, peer review, métricas impacto |

**Ubicación:** `docs/research_output/` en el repo HSCSG_v15_OS

---

## Evidencia Primaria Obligatoria (Citar Siempre)

| Fuente | Cita Canónica | DOI/URL |
|---|---|---|
| **ADSOA IEEE 2017** | Pérez-Leguizamo & Godínez-Borja, "Autonomous Decentralized Service Oriented Architecture...", IEEE ISADS 2017, pp. 47-54 | 10.1109/ISADS.2017.27 |
| **ADSOA IEICE 2016** | Pérez-Leguizamo et al., "ADSOA Concept and Application for Mission Critical Information Systems", IEICE Trans. Commun., Vol.E99-B No.4, pp. 803-812 | https://doi.org/10.1587/transcom.2015EBP3307 |
| **HSCSG v15 OS** | Ko, I., "HSCSG v15 OS Documentation", 2024-2026, GitHub: Isaacko0/HSCSG_v15_OS | https://github.com/Isaacko0/HSCSG_v15_OS |
| **Integraciones Previas** | Didacta/Educaas, Urbanika (12 repos), block/buzz (Nostr/Agentes), NEAR (Proof of Response) | Ver `docs/*_integration.md` |

---

## Metodología EBD (Evidence-Based Design) - Obligatoria

Todo paper/debe seguir el ciclo EBD documentado en **Documento 4**:

```
EVIDENCIA (Papers ADSOA, Benchmarks, Post-mortems)
    ↓
ANÁLISIS DE REQUISITOS CRÍTICOS (Gap Analysis)
    ↓
DISEÑO DE SOLUCIÓN (Arquitectura, APIs, Protocolos)
    ↓
PROTOTIPADO MÍNIMO (MVP por módulo ADS)
    ↓
VALIDACIÓN CUANTITATIVA (Tests, Benchmarks, Chaos Engineering)
    ↓
ITERACIÓN O CONFIRMACIÓN (Go/No-Go por métricas)
    ↓
DOCUMENTACIÓN TRAZABLE (Este documento)
```

**Decisiones EBD (D1-D8) — Usar como Referencia:**
| D# | Decisión | Evidencia | Módulo Afectado |
|---|---|---|---|
| D1 | ADSOA nativo vs SOA convencional | Pérez-Leguizamo 2017: "not acceptable for mission critical" | ACP, DF, CC |
| D2 | ACP por entidad | ADS: "autonomous controllability" | ACP.ts |
| D3 | DF replicado | ADSOA 2017: "several processes intercommunicated" | DataField.ts |
| D4 | Content Code semántico | IEICE 2016: "identifies message with its content" | ContentCode.ts |
| D5 | UV-PKI propia | ADSOA 2017: "root-CA partitioned... uniqueness verified" | UV-PKI.ts |
| D6 | Folio Structure | ADSOA 2017: "Folio Structure identifies the transaction" | FolioStructure.ts |
| D7 | Autonomous Guard | ADS: "continue operating despite failure" | AutonomyGuard.ts |
| D8 | Coordination Protocol | ADSOA: "autonomous coordinability" | CoordinationProtocol.ts |

---

## Estándares por Tipo de Output

### 3.1 Papers Académicos (IEEE ISADS, IEICE, ArXiv)
- **Formato:** LaTeX (IEEE template) / Markdown → Pandoc
- **Referencias:** BibTeX con DOIs obligatorios
- **Citación ADSOA:** Pérez-Leguizamo & Godínez-Borja 2017 (DOI: 10.1109/ISADS.2017.27)
- **Citación HSCSG:** Ko, I. "HSCSG v15 OS Documentation" (2024-2026) + GitHub repo + commit hash
- **Datos Abiertos:** Zenodo deposit al submission (DOI en paper)
- **Código:** GitHub release tag + DOI Zenodo
- **Checklist Pre-Submission:** Ver Documento 8, sección 3.1

### 3.2 Technical Reports / White Papers
- **Formato:** Markdown + Mermaid → PDF via Pandoc/WeasyPrint
- **Versionado:** vX.Y en header + Git tag `docs/vX.Y`
- **Diagramas:** Mermaid (`.mmd` en `docs/diagrams/`) → render en CI
- **Tablas:** Markdown nativo + CSV source en `data/tables/`

### 3.3 Blog Posts / Divulgación Técnica
- **Plataforma:** GitHub Discussions / HackMD / Mirror.xyz
- **Estructura:** Problema → Evidencia → Solución → Validación → Próximos pasos
- **Código:** Snippets + link a repo (líneas exactas)
- **Datos:** Gráficos interactivos + link a datos crudos

### 3.4 Presentaciones
- **Formato:** Markdown → Reveal.js (HTML) o PDF
- **Máx:** 20 slides / 20 min
- **Contenido mínimo:** 1. Problema+Evidencia 2. Solución ADSOA 3. Validación KPIs 4. Demo/Code 5. Próximos pasos

### 3.5 Datasets y Benchmarks (Zenodo + GitHub)
- **Formato:** CSV/JSONL + JSON Schema + README.md
- **Licencia:** CC0 (datos) / MIT (scripts)
- **Versionado:** `vYYYYMMDD-hash`
- **Reproducibilidad:** `run_benchmark.sh` + `environment.yml` / `package-lock.json`

---

## Trazabilidad Obligatoria (Citas Internas)

| Contexto | Formato | Ejemplo |
|---|---|---|
| **Decisión EBD** | `[EBD-D1]` | Link a `04_Documento_Diseno_Basado_Evidencia_EBD.md#2` |
| **Test KPI** | `[KPI-Availability]` | Link a test file + CI run |
| **Código** | `[src/core/state/ads/ACP.ts:L45-L60]` | Permalink GitHub |
| **Dato Bruto** | `[data/benchmark/latency_v20260818.csv]` | Zenodo DOI |
| **Decisión Validación** | `[DV-01]` | Link a `06_Memorandum_Validacion_Estrategica.md` |
| **Riesgo** | `[R1]` | Link a `06_Memorandum_Validacion_Estrategica.md` o `07_Informe_Factibilidad_Metodologica.md` |

---

## Flujo de Trabajo para Nuevo Paper/Documento

```bash
# 1. Crear branch
git checkout -b paper/nuevo-tema

# 2. Leer los 8 documentos base (obligatorio)
cat docs/research_output/01_Propuesta_Investigacion_Aplicada_ADSOA_HSCSG.md
cat docs/research_output/04_Documento_Diseno_Basado_Evidencia_EBD.md
cat docs/research_output/06_Memorandum_Validacion_Estrategica.md
cat docs/research_output/08_Protocolo_Comunicacion_Cientifica.md

# 3. Crear documento siguiendo plantilla correspondiente
# Usar header estándar:
# # TÍTULO
# **Referencia:** [CÓDIGO-YYYY-NNN] | **Fecha:** YYYY-MM-DD | **Versión:** X.Y
# **Autores:** [Nombres] | **Clasificación:** [PÚBLICO/ESTRATÉGICO/INTERNO] | **Estado:** [DRAFT/REVIEW/APPROVED/PUBLISHED]
# **DOI (si aplica):** 10.5281/zenodo.XXXXXX | **Git Tag:** `docs/vX.Y`

# 4. Internal Review (5 días hábiles)
# - PI + 1 Stakeholder mínimo
# - Verificar: todas las claims cuantitativas tienen KPI + test en repo
# - Figuras generadas desde código (scripts en `scripts/figures/`)
# - Tablas con fuentes citadas (EBD Decision Matrix ref)

# 5. Versionado + Tag Git
git add .
git commit -m "docs(paper): nuevo paper sobre X [EBD-D1, DV-01, KPI-Availability]"
git tag docs/v1.0-paper-x

# 6. Zenodo Deposit (inmediato al tag)
# - DOI + metadatos DataCite
# - Datos crudos en `data/raw/`, procesados en `data/processed/`
# - Scripts reproducción en `scripts/`

# 7. Publicar + Anunciar
# - GitHub Discussions + Twitter/LinkedIn + Mailing
# - Tracking métricas en `docs/impact_report_QX_YYYY.md`
```

---

## Principios de Vasos Comunicantes (Integración Cross-Repo)

Todo nuevo paper/documento debe **conectar explícitamente** con el resto del ecosistema HSCSG:

| Vaso Comunicante | Qué Conectar | Cómo Documentar |
|---|---|---|
| **Evidencia → Decisión** | Paper ADSOA → D1-D8 | Citar `[EBD-D1]` con link a Documento 4 |
| **Decisión → Módulo** | D1 → `ContentCode.ts` | Citar `[src/core/state/ads/ContentCode.ts]` |
| **Módulo → Test** | `ContentCode.ts` → test routing | Citar `[KPI-RoutingAccuracy]` |
| **Test → Validación** | Test → Go/No-Go Gate | Citar `[DV-01]` + Documento 6 |
| **Validación → Paper** | Gate 1 → Paper Sección 4 | Citar `[KPI-Availability]` + Zenodo DOI |
| **Paper → Próximo Paper** | Hallazgos → Nueva hipótesis | Citar `[H1]` en Documento 5 |

**Regla de Oro:** *Ningún documento existe en aislamiento. Cada claim debe tener su vaso comunicante hacia evidencia, código, test y decisión.*

---

## Checklist de Calidad (Pre-Publicación)

- [ ] **Evidencia Primaria:** Cita papers ADSOA (IEEE 2017, IEICE 2016) + HSCSG docs
- [ ] **Trazabilidad EBD:** Cada claim → decisión EBD (D1-D8) → test KPI
- [ ] **Reproducibilidad:** Código + datos + entorno = replicable (scripts en `scripts/`)
- [ ] **Atribución Justa:** ADSOA → Banco de México / Pérez-Leguizamo et al.; HSCSG → Isaac Ko / Isaacko0
- [ ] **Acceso Abierto:** Output en repo público (GitHub) + Zenodo (datos)
- [ ] **Versionado Semántico:** Documentos vX.Y; Código semver; Datos vYYYYMMDD-hash
- [ ] **Vasos Comunicantes:** Cada sección conecta con evidencia, código, test, decisión
- [ ] **Resultados Negativos:** Documentados en `docs/negative_results/` si aplica
- [ ] **Métricas Impacto:** Tracking definido (citations, downloads, stars, PRs)

---

## Plantillas de Referencia Rápida

### Header Estándar Documento
```markdown
# TÍTULO
**Referencia:** [CÓDIGO-YYYY-NNN] | **Fecha:** YYYY-MM-DD | **Versión:** X.Y
**Autores:** [Nombres] | **Clasificación:** [PÚBLICO/ESTRATÉGICO/INTERNO] | **Estado:** [DRAFT/REVIEW/APPROVED/PUBLISHED]
**DOI (si aplica):** 10.5281/zenodo.XXXXXX | **Git Tag:** `docs/vX.Y`
```

### Commit Message Convencional
```
type(scope): brief description

- Detailed bullet 1
- Detailed bullet 2

Refs: #issue-number
EBD: [EBD-D#]
KPI: [KPI-Name]
DV: [DV-#]
```

### Issue Template (GitHub)
```markdown
## Contexto / Evidencia
[Link a EBD decision / paper / benchmark]

## Objetivo
[Qué se quiere lograr + KPI target]

## Plan
- [ ] Paso 1
- [ ] Paso 2

## Validación
- [ ] Test unitario
- [ ] Test integración
- [ ] Benchmark (si aplica)

## Riesgos
- [Riesgo 1]: Mitigación
```

---

## Contacto y Escalación

| Rol | Nombre | Contacto | Disponibilidad |
|---|---|---|---|
| **PI / Protocol Owner** | Isaac Ko (Isaacko0) | isaacko@protonmail.com / GitHub @Isaacko0 | L-V 9-18h UTC-6 |
| **Stakeholder Review** | [Nombre] | [Email] | Bi-semanal 30min |
| **Technical Reviewer** | [Nombre] | [Email] | Según necesidad |
| **Emergencia Seguridad** | PI | isaacko@protonmail.com (PGP: 0x...) | 24/7 |

---

**Document Control:** Version 1.0 | 2026-08-18 | Author: Isaac Ko | Classification: PUBLIC — COMMUNITY STANDARD | Status: ACTIVE