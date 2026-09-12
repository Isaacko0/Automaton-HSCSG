---
name: hscsg-repo-assimilation-pipeline
description: Master pipeline for repo assimilation via HSCSG stack.
category: devops
version: 1.0.0
author: HSCSG
---

# HSCSG Repo Assimilation Pipeline Skill

## Purpose
Master pipeline orchestrating repository/paper assimilation using full HSCSG methodology stack.

## When to Use
- Assimilating curated repositories into Automaton-HSCSG
- Processing papers with business/technical analysis
- Full methodology stack application

## Methodology (from HSCSG v15 OS Full Stack + Alráico Kernel)

### Stage 1: Source Curation (Ontológica: qué ES la fuente)
- `hscsg-github-bookmark-extractor` - Extract GitHub URLs from bookmarks
- Manual curation of papers/docs
- **Alráico PI**: Identificar PI topológico por fuente
- **ECROx source**: αʰ, s, y, v, XP, k por fuente

### Stage 2: Business Analysis (Teleológica: qué HACE el negocio)
- `hscsg-reverse-business-architect` - Reverse-engineer source company models
- `hscsg-business-idea-validator` - Validate assimilation value (viability score ≥ 7)
- **Transducción F**: {modelo_origen} → 𝕮 → {modelo_destino}
- **Resonancia**: αʰ_origen·αʰ_destino·3.0 > αʰ_origen+αʰ_destino

### Stage 3: Operational Analysis (Axiológica: valorar la operación)
- `hscsg-operational-bottleneck-hunter` - Analyze source workflows for constraints
- Identify transferable mechanics vs bottlenecks
- **γ-CARMIS**: ΣPᵢ > κ detection en workflows origen
- **20 límites**: Mapear bottlenecks a límites L1-L20

### Stage 4: Financial/Personal Fit (Axiológica: valorar el fit)
- `hscsg-passive-income-architect` - Assess monetization fit for maintainers
- `hscsg-financial-analyst` - Model assimilation ROI
- `hscsg-coeficiente-autonomia` - AUT/CDS Gate MJ (AUT ≥ 0.618)
- `hscsg-monetary-integration` - G1/Túmin/PAR/Bitcoin/Stablecoins → ZCS/ZNU

### Stage 5: Design & Marketing (Ontológica/Teleológica/Axiológica)
- `hscsg-design-marketing-factory` - Generate design system + marketing assets
- Legal sanitization for public repo (transducción F)
- **Resonancia**: αʰ_design·αʰ_automaton·3.0 > αʰ_design+αʰ_automaton

### Stage 6: Assimilation Execution (Alráico Kernel Execution)
- `hscsg-repo-assimilation` - 4-phase assimilation (backup → analysis → generation → validation)
- `hscsg-unified-assimilation-science` - 5-phase unified science
- `hscsg-orquestador-skills` - 9-skill router with vasos comunicantes
- **Alráico tick**: 6 loops + γ-CARMIS + resonancia por repositorio
- **γ-CARMIS**: ΣPᵢ > κ → reconfiguración durante asimilación

### Stage 7: Validation & Documentation (Triaxial Verification)
- `hscsg-business-idea-validator` - Post-assimilation viability check (score ≥ 7)
- `hscsg-design-marketing-factory` - Generate docs/marketing for assimilated components
- Legal sanitization (transducción F: {propietario} → 𝕮 → {genérico})
- **Triaxial**: Mental + Simulación (test) + Lab (deploy)

### Orchestration Logic (Alráico Kernel Logic)
- Sequential by default, parallel where independent (vasos comunicantes)
- Viability gates between stages (score ≥ 7 ↔ AUT ≥ 0.618)
- Bottleneck findings inform assimilation strategy (γ-CARMIS)
- Financial fit determines maintenance model (AUT/CDS)
- Design system applied to assimilated components (resonancia)
- Legal sanitization before public commit (transducción F)
- **Tick Alráico**: 6 loops + γ-CARMIS + resonancia por stage
- **γ-CARMIS global**: ΣPᵢ > κ → reconfiguración pipeline completo
- **Resonancia global**: αʰ_stage₁·αʰ_stage₂·3.0 > αʰ_stage₁+αʰ_stage₂

## Configuration
- Target repo: Automaton-HSCSG
- Source: GitHub bookmarks + local papers
- Viability threshold: 7/10
- Legal sanitization: required for public
- Design system: Applied post-assimilation

## Output
- Assimilated components in Automaton-HSCSG
- Documentation (design system + marketing)
- Business mechanics playbooks
- Operational playbooks (bottleneck elimination)
- Financial models
- Legal-sanitized public version

## Integration with HSCSG (Vasos Comunicantes - Full Stack)
- **Full stack integration**: Todas las skills HSCSG v15 OS + Alráico kernel
- **Alráico loop principal**: Pipeline completo = 1 tick Alráico (6 loops + γ-CARMIS + resonancia)
- **AUT/CDS Gate MJ**: Cada stage requiere AUT ≥ 0.618 (hscsg-coeficiente-autonomia)
- **γ-CARMIS global**: ΣPᵢ > κ en cualquier stage → reconfiguración pipeline completo
- **Resonancia global**: αʰ_stage₁·αʰ_stage₂·3.0 > αʰ_stage₁+αʰ_stage₂ entre stages
- **ECROx global**: Variables propagadas entre stages (αʰ, s, y, v, XP, k)
- **Monetary anfibio**: ZNU/USDC via priceParity (hscsg-monetary-integration)
- **Legal**: Transducción F en cada stage (hscsg-design-marketing-factory)
- **Documentation**: hscsg-document-architect genera docs unificados por stage
- **Next steps**: hscsg-next-steps-orchestrator orquesta siguientes ticks
- **Financial prototype**: hscsg-urgent-financial-prototype deploy results
- **Scientific rigor**: hscsg-scientific-papers valida output
- **Loop engineering**: Sistema-Alraico-loop-engineering-skill para canvas
- **Target repo**: Automaton-HSCSG recibe componentes asimilados
- **Source**: GitHub bookmarks + local papers + HSCSG_v15_OS knowledge
- **Viability threshold**: 7/10 ↔ AUT ≥ 0.618 ↔ γ-CARMIS stable
- **Legal sanitization**: Required for public (transducción F)
- **Design system**: Applied post-assimilation (resonancia)
- **Output**: Assimilated components + docs + mechanics + ops playbooks + financial models + legal-sanitized version