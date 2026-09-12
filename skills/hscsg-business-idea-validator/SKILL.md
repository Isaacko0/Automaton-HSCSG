---
name: hscsg-business-idea-validator
description: VC-level validation with TAM/SAM, competition, score.
category: business
version: 1.0.0
author: HSCSG
---

# HSCSG Business Idea Validator Skill

## Purpose
VC-level business idea validation with exhaustive analysis and numeric viability score.

## When to Use
- Evaluating startup/business concepts with VC-level rigor
- Avoiding wasted effort, anticipating pitfalls
- Maximizing market success odds

## Methodology (from Validador de Ideas de Negocio + HSCSG v15 OS Alráico)

### Phase 1: Foundational Input (Ontológica: qué ES la idea)
- Core idea, target customer, value prop, unique details
- **Alráico PI**: Identificar PI topológico de la idea (B, A, C = B\A, ∀γ∈P(a,bᵢ), γ∩C≠∅)

### Phase 2: Market Sizing (Teleológica: qué HACE el mercado)
- TAM/SAM, growth trends, credible sources, verdict
- **Alráico Ω**: Medición energética del mercado (kWh equivalente)
- **AUT/CDS market**: AUT_mercado = Σ(αʰᵢ·sᵢ)/Σkᵢ

### Phase 3: Competitive Landscape (Axiológica: valorar la posición)
- Direct/indirect, saturation, barriers, verdict
- **Resonancia**: αʰ_idea·αʰ_competitor·3.0 > αʰ_idea+αʰ_competitor
- **ECROx competitive**: αʰ, s, y, v, XP, k por competidor

### Phase 4: Customer Subpersona (Ontológica: quién ES el cliente)
- Demographics/psychographics, 3+ pain points with examples
- **ECROx customer**: αʰ, s, y, v, XP, k por subpersona
- **Resonancia check**: αʰ_idea·αʰ_customer·3.0 > αʰ_idea+αʰ_customer

### Phase 5: Unique Value Prop (Teleológica: qué HACE la propuesta)
- Detailed analysis, strength rating
- **Transducción F**: {problema} → 𝕮 → {solución}
- **Transducción triaxial**: Mental + Simulación + Lab

### Phase 6: Revenue Streams (Axiológica: valorar el modelo)
- 2+ models, pricing, CAC, verdict
- **Anfibio pricing**: ZNU (offline) ↔ USDC (conectado via priceParity)
- **AUT/CDS revenue**: AUT ≥ 0.618 para modelo sostenible

### Phase 7: Feasibility (Teleológica: qué HACE falta)
- Technical/ops/regulatory/financial/HR, verdict
- **γ-CARMIS feasibility**: ΣPᵢ > κ? → reconfig antes de ejecutar
- **20 límites**: Mapear obstáculos a límites L1-L20

### Phase 8: Scalability (Teleológica: cómo CRECE)
- Operational/geographic/demographic, 2+ examples, verdict
- **Resonancia scale**: αʰ₁·αʰ₂·3.0 > αʰ₁+αʰ₂ entre mercados
- **ECROx scale**: Variables por mercado objetivo

### Phase 9: Risk Analysis (Axiológica: valorar el riesgo)
- 3+ vulnerabilities with primary/secondary/tertiary plans
- **γ-CARMIS risk**: ΣPᵢ > κ triggers → planes de contingencia
- **20 límites**: Mapear riesgos a límites L1-L20

### Phase 10: Online Sentiment (Ontológica: qué DICE el mercado)
- Reddit/community references, positive/mixed/negative
- **Triaxial sentiment**: Mental + Simulación (scraping) + Lab (test)

### Phase 11: Overall Score (Axiológica: valorar global)
- 1-10 score, summary, strengths/weaknesses, next steps
- **AUT/CDS Gate MJ**: Score ≥ 7 ↔ AUT ≥ 0.618
- **Alráico verdict**: Resonancia + AUT/CDS + γ-CARMIS ready

## Constraints
- Layperson-friendly language with technical accuracy
- Neutral, objective tone
- Each section: clear title, blank line, 3+ sentence detailed explanation in brackets
- Numeric viability score (1-10) + 2-3 sentence standalone summary
- 3+ concrete pain points with realistic examples
- 2+ revenue models, pricing strategies, CAC
- 3+ risks with primary/secondary/tertiary contingency plans
- Reddit/online community sentiment synthesis
- No follow-up questions unless iterative mode
- Output ready to use without clarification
- Exhaustive depth, exceeding baseline

## Output Format
- Summary of Business Idea
- Market Sizing and Trends (TAM/SAM, verdict)
- Competitive Landscape (verdict)
- Customer Subpersona & Pain Points (3+ examples)
- Unique Value Prop & Competitive Advantage (strength rating)
- Revenue Streams, Pricing, Monetization (CAC, verdict)
- Feasibility Assessment (tech/ops/regulatory/financial/HR, verdict)
- Scalability (2+ examples, verdict)
- Risk Analysis (3+ risks, 3 contingency plans each)
- Online Sentiment (Reddit references)
- Overall Viability Score (1-10) + Final Recommendation

## Integration with HSCSG (Vasos Comunicantes)
- Validation → hscsg-repo-assimilation (pre-assimilation gate)
- Score ≥ 7 → hscsg-repo-assimilation proceeds
- **Alráico loop**: Validation metrics → hscsg-sistema-alraico tick
- **AUT/CDS**: hscsg-coeficiente-autonomia valida Gate MJ (AUT ≥ 0.618)
- **γ-CARMIS**: Validation incluye pre-check ΣPᵢ > κ
- **Resonancia**: αʰ_idea·αʰ_market·3.0 > αʰ_idea+αʰ_market
- **ECROx**: Variables por sección (αʰ, s, y, v, XP, k)
- **Monetary**: hscsg-monetary-integration traduce revenue (ZNU/USDC)
- **Legal**: hscsg-design-marketing-factory sanitiza output
- **Documentation**: hscsg-document-architect genera validation report
- **Next steps**: hscsg-next-steps-orchestrator orquesta next actions
- **Financial prototype**: hscsg-urgent-financial-prototype si score ≥ 8