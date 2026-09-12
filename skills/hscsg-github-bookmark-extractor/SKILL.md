---
name: hscsg-github-bookmark-extractor
description: Extracts GitHub URLs from exported browser bookmarks HTML.
category: devops
version: 1.0.0
author: HSCSG
---

# HSCSG GitHub Bookmark Extractor Skill

## Purpose
Extract GitHub repository URLs from exported browser bookmarks (Netscape HTML format) for assimilation pipelines.

## When to Use
- Have exported browser bookmarks (Netscape HTML)
- Need to isolate GitHub repository links
- Feeding assimilation pipelines with curated repos

## Input
- Exported bookmarks HTML file (Netscape format from Chrome/Edge/Firefox)
- Default: `sections/bookmarks_16_7_26.html`

## Methodology (from extract_github_bookmarks.py + HSCSG v15 OS Alráico)

### Phase 1: Source Extraction (Ontológica: qué ES el bookmark)
- Read input HTML file (Netscape format)
- **Alráico PI**: Identificar PI topológico del bookmark (B, A, C = B\A, ∀γ∈P(a,bᵢ), γ∩C≠∅)
- Regex pattern: `<A\s+HREF="([^"]*github\.com[^"]*)"[^>]*>(.*?)</A>`
- Extract all GitHub URLs with titles

### Phase 2: Filtering & Classification (Teleológica: qué HACE el extractor)
- **Alráico mapping**: Cada repo = nodo 𝕮 con ECROx (αʰ, s, y, v, XP, k)
- **γ-CARMIS filter**: ΣPᵢ > κ? → si repo overloaded, flag para revisión
- **20 límites**: Mapear repo a límites cognitivos (ej. L13: competencia técnica)
- **Resonancia check**: αʰ_repo·αʰ_target·3.0 > αʰ_repo+αʰ_target

### Phase 3: Output Generation (Axiológica: valorar la salida)
- Output filtered Netscape HTML with only GitHub bookmarks
- Console log with count found
- **ECROx metadata**: Añadir variables ECROx a cada bookmark
- **Resonancia score**: αʰ_repo·αʰ_automaton·3.0 > αʰ_repo+αʰ_automaton

### Anfibio Mode
- **Offline (RAO local)**: Extracción local, sin API calls
- **Conectado**: Enriquecimiento via GitHub API (si token disponible)
- **priceParity**: Valoración repo en ZNU/USDC via hscsg-monetary-integration

## Output
- `github_bookmarks.html` - Filtered Netscape bookmark file
- Console log with count found

## Usage
```python
from hscsg_github_bookmark_extractor import extract_github_bookmarks
extract_github_bookmarks('path/to/bookmarks.html', 'github_bookmarks.html')
```

## Integration with HSCSG (Vasos Comunicantes)
- Output → hscsg-repo-assimilation-pipeline (Stage 1: Source Curation)
- Extracted repos → hscsg-reverse-business-architect (business analysis)
- Repo ECROx → hscsg-coeficiente-autonomia (AUT/CDS calculation)
- **Alráico loop**: Extraction metrics → hscsg-sistema-alraico tick
- **γ-CARMIS**: Overloaded repos flagged (ΣPᵢ > κ)
- **Resonancia**: αʰ_repo·αʰ_automaton·3.0 > αʰ_repo+αʰ_automaton
- **Monetary**: hscsg-monetary-integration valora repo (ZNU/USDC)
- **Validation**: hscsg-business-idea-validator valida repo (score ≥ 7)
- **Assimilation**: hscsg-repo-assimilation ejecuta 4 fases
- **Documentation**: hscsg-document-architect genera repo docs
- **Next steps**: hscsg-next-steps-orchestrator orquesta next actions
- **Financial**: hscsg-monetary-integration valora repo (ZNU/USDC)

## Requirements
- Python 3.x
- Input file in Netscape bookmark format
- Export from browser: Chrome/Edge → Bookmarks → Export