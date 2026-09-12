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

## Pipeline Stages

### Stage 1: Source Curation
- `hscsg-github-bookmark-extractor` - Extract GitHub URLs from bookmarks
- Manual curation of papers/docs

### Stage 2: Business Analysis
- `hscsg-reverse-business-architect` - Reverse-engineer source company models
- `hscsg-business-idea-validator` - Validate assimilation value (viability score)

### Stage 3: Operational Analysis
- `hscsg-operational-bottleneck-hunter` - Analyze source workflows for constraints
- Identify transferable mechanics vs bottlenecks

### Stage 4: Financial/Personal Fit
- `hscsg-passive-income-architect` - Assess monetization fit for maintainers
- `hscsg-financial-analyst` - Model assimilation ROI

### Stage 5: Design & Marketing
- `hscsg-design-marketing-factory` - Generate design system + marketing assets
- Legal sanitization for public repo

### Stage 6: Assimilation Execution
- `hscsg-repo-assimilation` - 4-phase assimilation (backup → analysis → generation → validation)
- `hscsg-unified-assimilation-science` - 5-phase unified science
- `hscsg-orquestador-skills` - 9-skill router with vasos comunicantes

### Stage 7: Validation & Documentation
- `hscsg-business-idea-validator` - Post-assimilation viability check
- `hscsg-design-marketing-factory` - Generate docs/marketing for assimilated components
- Legal sanitization (proprietary term mapping)

## Orchestration Logic
- Sequential by default, parallel where independent
- Viability gates between stages (score ≥ 7 to proceed)
- Bottleneck findings inform assimilation strategy
- Financial fit determines maintenance model
- Design system applied to assimilated components
- Legal sanitization before public commit

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

## Integration
- Uses all HSCSG skills as orchestrated pipeline
- Feeds Automaton-HSCSG with assimilated components
- Generates documentation automatically
- Maintains legal compliance
- Produces marketing assets for launch