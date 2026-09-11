#!/usr/bin/env python3
"""
integrate_reference.py — Placeholder funcional para integración de nuevos referentes monetarios.
Lee el documento HSCSG, detecta si el referente ya está integrado, y prepara el parche sugerido.
Uso:
    python scripts/integrate_reference.py --referente G1 --doc C:/Users/Isaacko0/modelo-negocio-objetivos-civilizatorios-hscsg.md
    python scripts/integrate_reference.py --referente Tumin --doc ...
    python scripts/integrate_reference.py --referente PAR --doc ...
"""
import argparse
from pathlib import Path

REFERENTES = {
    "G1": "Moneda Libre G1 (Juna)",
    "Tumin": "Túmin",
    "PAR": "Moneda PAR",
    "Bitcoin": "Bitcoin / Lightning Network",
    "Stablecoins": "Stablecoins soberanas",
    "BancosTiempo": "Bancos de tiempo",
}


def check_integrated(doc_path: Path, referente: str) -> bool:
    content = doc_path.read_text(encoding="utf-8")
    return REFERENTES.get(referente, referente) in content


def suggest_integration(referente: str) -> str:
    return (
        f"Para integrar '{referente}':\n"
        f"1. Leer sección 14 del documento HSCSG.\n"
        f"2. Extraer principios estructurales del referente.\n"
        f"3. Agregar fila en tabla de principios (sección 14.1).\n"
        f"4. Ampliar sección 14.2 o 14.3 según corresponda.\n"
        f"5. Actualizar métricas en 14.6 si aplica.\n"
        f"6. Actualizar riesgos en 14.7 si aplica.\n"
        f"7. Ejecutar 'python scripts/verify_hscsg.py' para validar.\n"
    )


def main():
    parser = argparse.ArgumentParser(description="Integrar referente monetario en HSCSG")
    parser.add_argument("--referente", required=True, choices=list(REFERENTES.keys()))
    parser.add_argument("--doc", default="C:/Users/Isaacko0/modelo-negocio-objetivos-civilizatorios-hscsg.md")
    args = parser.parse_args()

    doc_path = Path(args.doc)
    if not doc_path.exists():
        print(f"Error: documento no encontrado en {doc_path}")
        return 1

    if check_integrated(doc_path, args.referente):
        print(f"✅ '{REFERENTES[args.referente]}' ya está integrado en el documento.")
        return 0

    print(f"⚠️  '{REFERENTES[args.referente]}' NO está integrado.")
    print(suggest_integration(args.referente))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
