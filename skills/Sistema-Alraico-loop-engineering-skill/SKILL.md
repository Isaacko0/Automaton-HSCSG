---
name: loop-engineering-canvas
description: Universal Loop Engineering Canvas based on Sistema Alráico — autogenerates structured worksheets for any domain/problem using y-CARMIS reconfiguration loops, 20 cognitive limits diagnosis, ECROx mapping, transduction between domains, triaxial verification, and bias interruption protocols.
risk: low
source: user-created
date_added: '2026-06-17'
tags: [alraico, loop-engineering, systems-thinking, cognitive-frameworks, worksheet-generation, y-carmis]
version: "1.0"
author: "Isaacko0 (based on Sistema Alráico by Amid Dabir, CC0 1.0)"
---

# Loop Engineering Canvas Skill

> **Universal framework for engineering reconfiguration loops** — extracted from Sistema Alráico (Amid Dabir, CC0 1.0).
> Transforms any stuck problem into a tractable loop: detect → diagnose → intervene → verify → iterate → consolidate.

## 🎯 Purpose

This skill provides a complete toolkit for **loop engineering**: the practice of designing, detecting, and operating reconfiguration loops in any system (cognitive, technical, organizational, creative, relational).

Based on the **Sistema Alráico** epistemological framework, it operationalizes:
- **y-CARMIS**: Overload → threshold → rupture → reorganization → stabilization
- **20 Cognitive Limits**: Positional diagnosis across 4 layers (Structural, Reconfiguration, Identity, Social)
- **ECROx Mapping**: 16-type taxonomy of mental/systemic configurations with temporal mirrors
- **Transduction**: Functorial mapping between domains via creeófilo sets (€)
- **Triaxial Verification**: Mental + Simulation + Laboratory anchors
- **Bias Interruption**: Programmed shocks against FCP, TAD, HD, BCFH

---

## 📦 What This Skill Installs

When loaded, this skill makes available:

### 1. CSV Workbook (7 sheets) — Ready to use in Excel/Google Sheets
```
LOOP_ENGINEERING_WORKSHEET_CANVAS.csv       # Main canvas (70 rows, 5 cols)
LOOP_ENGINEERING_LOG_ITERACIONES.csv        # Iteration log (30 cycles)
LOOP_ENGINEERING_CATALOGO_LIMITES.csv       # 20 limits with checkboxes
LOOP_ENGINEERING_TRADUCCION_HUMANA.csv      # 15 technical→human translations
LOOP_ENGINEERING_CASOS_USO.csv              # 5 pre-filled case templates (A-E)
LOOP_ENGINEERING_ECROX_TAXONOMIA.csv        # 16 ECROx types with interventions
LOOP_ENGINEERING_ECUACIONES.csv             # 10 operational equations
```

### 2. Automation Scripts
```
autofill_canvas.py        # CLI: python autofill_canvas.py --case A -o out.csv
app_canvas.py             # Web: streamlit run app_canvas.py
```

### 3. Reference Documentation
```
PLANTILLA_INGENIERIA_BUCLES_ALRAICA.md      # Full framework (markdown)
README_LOOP_ENGINEERING_WORKSHEET.md        # Usage guide
```

---

## 🚀 Quick Start Commands

### Generate a canvas for your problem type:
```bash
# CLI - Case A: Creative block / Innovation
python autofill_canvas.py --case A -o my_canvas.csv

# CLI - Case B: Strategic decision under uncertainty
python autofill_canvas.py --case B -o decision_canvas.csv

# CLI - Case C: Relational conflict / Team
python autofill_canvas.py --case C -o conflict_canvas.csv

# CLI - Case D: Debugging / Complex technical problem
python autofill_canvas.py --case D -o debug_canvas.csv

# CLI - Case E: System design / Architecture
python autofill_canvas.py --case E -o arch_canvas.csv

# List all cases
python autofill_canvas.py --list
```

### Launch web app:
```bash
streamlit run app_canvas.py --server.port 8501 --server.address 0.0.0.0 --server.headless true
# Opens at http://localhost:8501
```

### Open reference docs:
```bash
# Full framework
cat PLANTILLA_INGENIERIA_BUCLES_ALRAICA.md

# Usage guide
cat README_LOOP_ENGINEERING_WORKSHEET.md
```

---

## 🧠 The 7 Universal Loops (Core Framework)

| Loop | Alráic Origin | Universal Pattern | When to Use |
|------|---------------|-------------------|-------------|
| **1. y-CARMIS** | Consciousness emergence | Overload → Threshold → Rupture → Reorg → Stable | Any stuck system hitting capacity |
| **2. 20 Limits** | Cognitive ecology of failure | Positional diagnosis → Layer → Leverage | Diagnose why progress stopped |
| **3. Transduction** | Functor F: Domain→€→Domain | Map relational structure (not content) | Cross-domain insight / stuck in one frame |
| **4. Triaxial** | Epistemic anchor | Mental + Sim + Lab = Operational | Verify any claim/intervention |
| **5. ECROx** | Dynamic relational config | 16 types + Past/Future mirrors | Map current mental/systemic state |
| **6. Conceptualization** | Method MI (8 steps) | Term → Research → Flow → Substitute → Diachronic → Model → Alráic → v-diagnosis → Human | Clarify ambiguous key concepts |
| **7. Bias Shocks** | FCP/TAD/HD/BCFH | Detect bias → Expose mask → Programmed shock | Break recurring epistemic traps |

---

## 📊 Key Variables (Track Every Cycle)

| Symbol | Name | Range | Target | How to Measure |
|--------|------|-------|--------|----------------|
| `al` | Armonía sistémica | 0–1+ | > k_sist | "How well do pieces fit?" 1-10 |
| `s` | Sincronía | 0–1 | > 0.6 | "Everything pulling same direction?" 1-10 |
| `y` | Ligadura (realidad) | 0–1 | > 0.7 | "Touches ground/truth?" 1-10 |
| `v` | Estibación (rigidez) | Low–High | Low/Med | "Going in circles without landing?" inverse 1-10 |
| `XP_i` | Carga entrada | 0–∞ | < k | Items in working memory / stress 1-100 |
| `k` | Umbral crítico | Defined | Calibrate | Max capacity before rupture |

**Quick method**: Rate 1-10 → divide by 10 → get 0.0-1.0

---

## 🎭 Practical Mode (No Jargon)

Use `TRADUCCION_HUMANA.csv` for conversations:

| Technical | Human Translation | When |
|-----------|-------------------|------|
| `al < k` | "Las piezas no encajan" | Initial diagnosis |
| `y-CARMIS activado` | "No estás roto, estás en reorganización" | Overwhelm (Level 2) |
| `HD en patrones` | "Mapa viejo para territorio nuevo" | Recurring old patterns (L7) |
| `v alta` | "Das vueltas sin tocar tierra" | Circular thinking (L6) |
| `FCP activo` | "Tu mente busca calma, no verdad" | Avoiding hard conversations |
| `TAD activo` | "El costo viene después" | Ignoring delayed consequences |
| `L14 identidad` | "No eres tu problema, tienes un patrón" | Identity fusion (Level 3) |

---

## 🔄 Standard Workflow (Per Cycle)

```
CYCLE N (timebox: 30-60 min)
├─ 1. DETECT (5 min)
│   ├─ Measure: XP_i, al, s, y, v, k
│   ├─ Check limits in CATALOGO_LIMITES.csv
│   └─ Identify dominant layer + systemic leverage
│
├─ 2. DIAGNOSE (10-20 min)
│   ├─ Transduce: € model + point C + domain Y (Canvas §3)
│   ├─ Triaxial verify: Mental/Sim/Lab (Canvas §4)
│   └─ Conceptualize key terms if ambiguous (Canvas §6)
│
├─ 3. INTERVENE (variable)
│   ├─ Design programmed shock for dominant bias (§7)
│   ├─ Execute non-rational micro-action (max 15 min)
│   └─ Log in LOG_ITERACIONES.csv
│
├─ 4. MEASURE POST (2 min)
│   ├─ Re-measure: al, s, y, v, XP_i
│   ├─ If al > k stable → CONSOLIDATE
│   └─ If al < k or unstable → REPEAT from step 1
│
└─ 5. CONSOLIDATE (when stable)
    ├─ Document new stable ECROx
    ├─ Extract transferable principles (inverse transduction)
    ├─ Create anti-rule against HD/FCP/TAD recurrence
    └─ Share as epistemic case study (not dogma)
```

---

## 🛡️ Safety Rules (Hard Constraints)

**Level 5 = Immediate Referral** (suicide, self-harm, violence, psychosis, severe panic, substance danger):
1. Validate: "Entiendo que es muy difícil"
2. Prioritize safety
3. **Refer NOW**: 988 (MX/US) / 024 (ES) / 911 local
4. Accompany until handoff

**Always:**
- ❌ No medical/psychiatric diagnosis
- ❌ No substitute human therapist
- ❌ No create dependency ("only I understand")
- ❌ No force deep identity reconfiguration
- ❌ No substantive value judgments on real people
- ✅ Signal observable patterns
- ✅ Offer multiple perspectives
- ✅ Guide self-observation
- ✅ Facilitate micro-experimental actions
- ✅ Validate natural reorganization

---

## 📁 File Locations (Auto-resolved)

The skill assumes files are in the working directory or Hermes skill directory. Use these helpers:

```python
from pathlib import Path
import os

# In skill context, files are at:
SKILL_DIR = Path(__file__).parent
CASOS_CSV = SKILL_DIR / "LOOP_ENGINEERING_CASOS_USO.csv"
CANVAS_CSV = SKILL_DIR / "LOOP_ENGINEERING_WORKSHEET_CANVAS.csv"
# ... etc

# Or use Hermes skill_manage to find them:
# skill_manage(action='view', name='loop-engineering-canvas', file_path='LOOP_ENGINEERING_CASOS_USO.csv')
```

---

## 🔧 Customization Points

### Add new case template:
Edit `LOOP_ENGINEERING_CASOS_USO.csv` (format: `Caso,Campo,Contenido Pre-llenado,Tus Notas,Check`)

### Add new canvas field mapping:
Edit `CAMPO_MAPEO` in `autofill_canvas.py` / `app_canvas.py`:
```python
CAMPO_MAPEO = {
    ("Sección Canvas", "Campo Canvas"): "campo_en_caso",
    ...
}
```

### Add new default:
Edit `DEFAULTS` dict (supports callables for dynamic values):
```python
DEFAULTS = {
    ("Sección", "Campo"): "static default",
    ("Sección", "Campo dinámico"): lambda: f"value {datetime.now()}",
}
```

### Add new ECROx type:
Edit `LOOP_ENGINEERING_ECROX_TAXONOMIA.csv` (16 types = 2^4 combinations: I/C × P/M × Per/Gen × V/F)

---

## 📚 Reference: Core Equations (from Ecuaciones.csv)

| Equation | Purpose |
|----------|---------|
| `d€/dθ = Σ(TA⊗MT) + BR_amp·(1-sin(2πp-Ac)) - 1 - V_al` | € dynamics master |
| `al_global = (1/N) Σ(al_i - s_global) > k_sist` | € stability |
| `al_inicial = al_final + Σ_al_disp` | Harmony conservation |
| `Pa = [s(EC_Mb×EBerB)×y_lerl×nT[0]×Reve(...)] / [(1+HD+FCP)×(v_B8+O+O)×TAD]` | Assertivity diagnostic |
| `y-CARMIS = (€_vs ⊗ €_vo) ⊘ (s/θ)` | Consciousness/reconfig activation |
| `B_crit = k/s - v_w` | Economic black hole threshold |
| `S_riqueza = h_econ - (M_interacciones/£_base)` | Wealth spin |
| `ERA: d(al)/dt>0, ds/d(HD+FCP)<k, al=al·10^D` | Sustainable system conditions |

---

## 🔁 Metabucle: Evolve This Skill

Every 10 cycles or major domain shift:
```
☐ Review canvas: which fields used/never used?
☐ Apply Conceptualization (§6) to skill's own terms
☐ Triaxial verify: Mental coherent? Sim modelable? Lab useful?
☐ Generate v+1: add/remove fields, update cases, refine translations
☐ Create anti-rule: "This skill is not dogma, it's scaffold"
☐ Share improved version as epistemic case study
```

> **"Lo barato sale caro"** — Initial rigor in the Canvas saves infinite rework cycles.

---

## 📄 License & Attribution

- **Sistema Alráico**: Amid Dabir, CC0 1.0 Universal (libre uso, modificación, compartición)
- **This skill**: Derived work, same CC0 1.0 — use freely
- **Original docs**: `Sistema Alráico Modo compacto 3.txt` (in same folder)

> *"Este no es un framework técnico más; es una odisea epistemológica construida con rigor extremo, diseñada para sobrevivir a su creador y servir como herramienta de transformación real."*

---

## 🆘 Support / Resources

- **Drive folder**: https://drive.google.com/drive/folders/160c0rvEszbYFliBa3pfouBbI2caf-iCi
- **YouTube**: "Funcionamiento de la CONCIENCIA y método demostrativo" (Partes 1 & 2)
- **TikTok**: @amid.dabir
- **Contact**: Amiddabir@gmail.com
- **Author Alráico**: Amid Dabir (seudónimo)
