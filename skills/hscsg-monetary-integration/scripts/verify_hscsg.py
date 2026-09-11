#!/usr/bin/env python3
"""
verify_hscsg.py — Verifica integridad de modelo-negocio-objetivos-civilizatorios-hscsg.md
Detecta artefactos OUT-OF-BAND, encabezados duplicados y valida tablas monetarias.
"""
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

DEFAULT_DOC = Path("C:/Users/Isaacko0/modelo-negocio-objetivos-civilizatorios-hscsg.md")


def check_out_of_band(content: str) -> List[str]:
    issues = []
    if "OUT-OF-BAND" in content:
        issues.append("Artefacto OUT-OF-BAND detectado")
    if "|||" in content:
        issues.append("Artefacto de formato ||| detectado")
    return issues


def check_duplicate_headings(content: str) -> List[str]:
    lines = content.split("\n")
    headings = [line.strip() for line in lines if line.startswith("## ")]
    seen = {}
    dupes = []
    for h in headings:
        seen[h] = seen.get(h, 0) + 1
    for h, count in seen.items():
        if count > 1:
            dupes.append(f"Encabezado duplicado (x{count}): {h}")
    return dupes


def check_monetary_tables(content: str) -> List[str]:
    issues = []
    # Verifica que la sección 14 tenga la tabla de principios con 6 filas
    if "## 14. ARQUITECTURA MONETARIA CIVILIZATORIA" in content:
        principles_block = content[
            content.find("## 14. ARQUITECTURA MONETARIA CIVILIZATORIA") :
            content.find("### 14.2")
        ]
        expected_principles = [
            "Creación monetaria democrática",
            "Valor relativo, no absoluto",
            "Sin interés ni deuda perpetua",
            "Circuito cerrado complementario",
            "Gobernanza comunitaria de emisión",
            "Moneda no oficial ni obligatoria",
            "Trueque sin interés ni acumulación",
        ]
        missing = [p for p in expected_principles if p not in principles_block]
        if missing:
            issues.append(f"Principios faltantes en sección 14.1: {missing}")
    return issues


def check_metrics_table(content: str) -> List[str]:
    issues = []
    required_metrics = [
        "Cobertura ZCS",
        "Velocidad de circulación ZNU",
        "Índice de demurrage efectivo",
        "Brecha de fuga",
        "Paridad ZNU/USDC",
        "Accesibilidad monetaria",
        "Volumen de trueque ZCS",
        "Índice de reciprocidad PAR",
        "Deuda perpetua ZCS",
    ]
    for metric in required_metrics:
        if metric not in content:
            issues.append(f"Métrica faltante: {metric}")
    return issues


def check_glossary(content: str) -> List[str]:
    issues = []
    required_terms = [
        "Moneda Libre (G1 / Juna)",
        "Dividendo Universal (DU)",
        "Túmin",
        "Moneda PAR",
        "ZCS",
        "ZNU",
        "ValueFlows",
        "Demurrage",
        "Oráculo de paridad local",
        "Crédito circular",
    ]
    for term in required_terms:
        if term not in content:
            issues.append(f"Término de glosario faltante: {term}")
    return issues


def report(doc_path: Path) -> Tuple[bool, List[str]]:
    content = doc_path.read_text(encoding="utf-8")
    issues = []
    issues.extend(check_out_of_band(content))
    issues.extend(check_duplicate_headings(content))
    issues.extend(check_monetary_tables(content))
    issues.extend(check_metrics_table(content))
    issues.extend(check_glossary(content))

    # Info básica
    lines = len(content.split("\n"))
    size_kb = len(content.encode("utf-8")) / 1024

    print(f"Documento: {doc_path}")
    print(f"Líneas: {lines}")
    print(f"Tamaño: {size_kb:.1f} KB")

    if issues:
        print("\n❌ PROBLEMAS DETECTADOS:")
        for i in issues:
            print(f"  - {i}")
        return False, issues
    else:
        print("\n✅ Documento limpio y completo")
        return True, []


if __name__ == "__main__":
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DOC
    ok, issues = report(path)
    sys.exit(0 if ok else 1)
