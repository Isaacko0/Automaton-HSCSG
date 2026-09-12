#!/usr/bin/env python3
"""
=============================================================================
AUTO-COMPLETAR CANVAS LOOP ENGINEERING — Desde Casos de Uso
=============================================================================
Script que toma una plantilla de CASOS_DE_USO.csv y vuelca sus campos
pre-llenados en el CANVAS.csv, generando un Canvas listo para trabajar.

Uso:
    python autofill_canvas.py                    # Modo interactivo
    python autofill_canvas.py --case A           # Caso A directo
    python autofill_canvas.py --case B -o mi_canvas.csv  # Caso B con salida custom
    python autofill_canvas.py --list             # Listar casos disponibles
=============================================================================
"""

import csv
import sys
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime


# =============================================================================
# CONFIGURACIÓN DE RUTAS (ajusta si moviste los archivos)
# =============================================================================
BASE_DIR = Path(__file__).parent
CASOS_CSV = BASE_DIR / "LOOP_ENGINEERING_CASOS_USO.csv"
CANVAS_TEMPLATE_CSV = BASE_DIR / "LOOP_ENGINEERING_WORKSHEET_CANVAS.csv"
DEFAULT_OUTPUT = BASE_DIR / "CANVAS_AUTOCOMPLETADO.csv"


# =============================================================================
# MAPEO: Casos de Uso → Secciones/Campos del Canvas
# =============================================================================
# Cada entrada: (sección_canvas, campo_canvas) <- campo_caso_uso
CAMPO_MAPEO = {
    # Sección 1: y-CARMIS
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Umbral k (crítico)"): "y-CARMIS k",
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Protocolo de reconfiguración"): "Choque",
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Nueva estabilidad esperada (métricas)"): "Métrica éxito",

    # Sección 2: Límites
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Límites activos (marcar)"): "Límites dominantes",
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Intervención prioritaria"): "Choque",

    # Sección 3: Transducción
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Transducción"): "Transducción",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Verificación triaxial"): "Verificación triaxial",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Intervención en Y"): "Choque",

    # Sección 5: ECROx
    ("5. ECROx — MAPEO", "Ecrox actuales (notación I/C-M/P-Per/Gen-V/F)"): "Ecrox clave",
    ("5. ECROx — MAPEO", "Intervención y-CARMIS diseñada"): "Choque",

    # Sección 7: Sesgos
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Sesgo detectado"): "Sesgo",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Choque programado diseñado"): "Choque",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Acción concreta"): "Choque",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Métrica de éxito"): "Métrica éxito",
}


# Campos que se auto-rellenan con valores por defecto
DEFAULTS = {
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Fecha / Iteración #"): lambda: datetime.now().strftime("%Y-%m-%d %H:%M"),
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Sistema / Objetivo"): "[Completar: nombre del sistema/problema]",
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Capacidad actual (medida)"): "[Medir: carga cognitiva 0-100, ancho banda, etc.]",
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Señales XP_i > k"): "☐ Bloqueo  ☐ Rumiación  ☐ Error sistémico  ☐ Otro: ____",
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Capa dominante"): "☐ Estructural  ☐ Reconfiguración  ☐ Identitaria  ☐ Social",
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Bucles retroalimentación"): "[Mapear ciclos: ej. L9→L10→L4→L9]",
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Palanca sistémica"): "[Conexión entre capas a intervenir]",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Problema origen (dominio + desc.)"): "[Completar: dominio + descripción breve]",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "€ Modelo: componentes"): "[Listar nodos interactivos del sistema]",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "€ Modelo: al_actual / s_actual / y_actual / v_actual"): "[Medir: armonía, sincronía, ligadura, estibación 0-1]",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Punto C (incapacidad densa)"): "[Dónde falla sincronía / al<k / v alta / HD/FCP]",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Dominio Y análogo"): "[Dominio donde estructura es más visible]",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Resultado esperado en X"): "[Métrica/observables de retorno al dominio original]",
    ("4. VERIFICACIÓN TRIAXIAL", "Claim / Propuesta a verificar"): "[Completar: claim principal a verificar]",
    ("4. VERIFICACIÓN TRIAXIAL", "Eje Mental: Coherente? Autopercepción C?"): "☐ Sí  ☐ No  ☐ Parcial",
    ("4. VERIFICACIÓN TRIAXIAL", "Eje Simulación: Modelable? Predice?"): "☐ Sí  ☐ No  ☐ Parcial",
    ("4. VERIFICACIÓN TRIAXIAL", "Eje Laboratorio: Datos empíricos? Falsable?"): "☐ Sí  ☐ No  ☐ Parcial",
    ("4. VERIFICACIÓN TRIAXIAL", "Veredicto"): "☐ OPERATIVO  ☐ REVISAR v  ☐ RECHAZAR",
    ("4. VERIFICACIÓN TRIAXIAL", "Estibación residual (v)"): "☐ Baja  ☐ Media  ☐ Alta  Anclajes: ____",
    ("4. VERIFICACIÓN TRIAXIAL", "Ligadura (y) con inherente"): "☐ Alta (>0.8)  ☐ Media (0.5-0.8)  ☐ Baja (<0.5)",
    ("5. ECROx — MAPEO", "Ecrox Falaces (F) + Límite activado"): "[Ej: C-M-Gen-F → L6; I-P-Gen-F → L9...]",
    ("5. ECROx — MAPEO", "Espejo Pasado — Precedente Necesario"): "[Reconstrucción deductiva: ¿qué Ecrox previos explican el actual?]",
    ("5. ECROx — MAPEO", "Espejo Futuro — Consecuente Posible"): "[Proyección inductiva: ¿qué Ecrox emergen si reconfiguramos?]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "Término / Concepto"): "[Completar: término clave a conceptualizar]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P1 - Usos reales + homógrafos"): "[Contextos formales/informales, homógrafos separados]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P2 - Flujos interpretativos + inconsistencias históricas"): "[Categorías de significado + usos contradictorios MANTENER ACTIVOS]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P3 - Sustituciones experimentales"): "[Sinónimos/antónimos: ¿cambia significado? ¿indispensable?]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P4 - Diacronía + Sociolingüística"): "[Evolución histórica + efecto en oyente actual]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P5 - Modelo científico (analogía formal)"): "[Ej: topología, termodinámica, teoría de grafos, categorías]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P6 - Concepto Alráico (definición operativa)"): "[Términos: PI, y, s, al, v, C, €, anti-reglas, nT[0]]",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P7 - Diagnóstico v (estibación)"): "☐ Baja  ☐ Media (anclaje: ____)  ☐ Alta  Anclajes débiles/fuertes: ____",
    ("6. CONCEPTUALIZACIÓN ROBUSTA (8 Pasos)", "P8 - Versión Humana (metáfora + semilla autoconciencia)"): "[Núcleo relacional + analogía evocadora + semilla de autoconciencia]",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Máscara activa (racionalización)"): "[Identificar la racionalización que sostiene el sesgo]",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Frecuencia / Cadencia"): "[Cada cuánto repetir el choque]",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Verificación post-choque"): "☐ Mental  ☐ Simulación  ☐ Laboratorio",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "al (armonía sistémica)"): "Meta: > k_sist | Actual: ",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "s (sincronía)"): "Meta: > 0.6 | Actual: ",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "y (ligadura con inherente)"): "Meta: > 0.7 | Actual: ",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "v (estibación)"): "Meta: Baja/Media | Actual: ",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "C (incapacidad densa)"): "Mapeada: ☐ Sí  ☐ No | Ubicación: ",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "XP_i (carga/pulsos entrada)"): "Umbral k: | Actual: ",
    ("8. MÉTRICAS DE SEGUIMIENTO (KPIs)", "k (umbral crítico)"): "Definido: | Valor: ",
}


# =============================================================================
# ESTRUCTURAS DE DATOS
# =============================================================================
@dataclass
class CasoUso:
    """Representa un caso de uso (A, B, C, D, E) con sus campos."""
    nombre: str
    campos: Dict[str, str]  # campo_caso_uso -> contenido


@dataclass
class CanvasRow:
    """Una fila del Canvas: sección, campo, valor, notas, check."""
    seccion: str
    campo: str
    valor: str
    notas: str
    check: str


# =============================================================================
# FUNCIONES DE LECTURA/ESCRITURA CSV
# =============================================================================
def leer_casos_uso(ruta: Path) -> List[CasoUso]:
    """Lee CASOS_DE_USO.csv y devuelve lista de CasoUso."""
    casos: Dict[str, CasoUso] = {}

    with open(ruta, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            caso_nombre = row['Caso'].strip()
            campo = row['Campo'].strip()
            contenido = row['Contenido Pre-llenado'].strip()

            if caso_nombre not in casos:
                casos[caso_nombre] = CasoUso(nombre=caso_nombre, campos={})
            if campo and contenido:
                casos[caso_nombre].campos[campo] = contenido

    return list(casos.values())


def leer_canvas_template(ruta: Path) -> List[CanvasRow]:
    """Lee el template CANVAS.csv y devuelve filas parseadas."""
    filas = []
    with open(ruta, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            filas.append(CanvasRow(
                seccion=row['Sección'].strip(),
                campo=row['Campo'].strip(),
                valor=row['Valor/Entrada'].strip(),
                notas=row['Notas'].strip() if 'Notas' in row else '',
                check=row['Check'].strip() if 'Check' in row else ''
            ))
    return filas


def escribir_canvas(ruta: Path, filas: List[CanvasRow]):
    """Escribe el Canvas autocompletado a CSV."""
    fieldnames = ['Sección', 'Campo', 'Valor/Entrada', 'Notas', 'Check']
    with open(ruta, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in filas:
            writer.writerow({
                'Sección': row.seccion,
                'Campo': row.campo,
                'Valor/Entrada': row.valor,
                'Notas': row.notas,
                'Check': row.check
            })


# =============================================================================
# LÓGICA DE AUTOCOMPLETADO
# =============================================================================
def autocompletar_canvas(
    canvas_rows: List[CanvasRow],
    caso: CasoUso,
    verbose: bool = True
) -> Tuple[List[CanvasRow], int, int]:
    """
    Rellena el canvas con datos del caso de uso.
    Returns: (filas_actualizadas, count_mapeados, count_defaults)
    """
    mapeados = 0
    defaults_aplicados = 0

    # Convertir a dict para búsqueda rápida: (sección, campo) -> índice
    canvas_index = {(r.seccion, r.campo): i for i, r in enumerate(canvas_rows)}

    # 1. Aplicar mapeo directo desde Caso de Uso
    for (seccion, campo), campo_caso in CAMPO_MAPEO.items():
        if (seccion, campo) in canvas_index and campo_caso in caso.campos:
            idx = canvas_index[(seccion, campo)]
            canvas_rows[idx].valor = caso.campos[campo_caso]
            canvas_rows[idx].check = "✅"  # Marcar como autocompletado
            mapeados += 1
            if verbose:
                print(f"  ✓ Mapeado: [{seccion}] {campo} ← '{campo_caso}'")

    # 2. Aplicar defaults para campos vacíos
    for (seccion, campo), default_fn in DEFAULTS.items():
        if (seccion, campo) in canvas_index:
            idx = canvas_index[(seccion, campo)]
            if not canvas_rows[idx].valor or canvas_rows[idx].valor.startswith("["):
                # Solo aplicar si está vacío o es placeholder
                canvas_rows[idx].valor = default_fn() if callable(default_fn) else default_fn
                defaults_aplicados += 1
                if verbose:
                    print(f"  ↳ Default: [{seccion}] {campo}")

    return canvas_rows, mapeados, defaults_aplicados


# =============================================================================
# INTERFAZ DE USUARIO
# =============================================================================
def listar_casos(casos: List[CasoUso]):
    """Muestra casos disponibles con resumen."""
    print("\n📋 CASOS DE USO DISPONIBLES:")
    print("─" * 70)
    for c in casos:
        # Extraer letra inicial (A., B., C., D., E.)
        letra = c.nombre.split('.')[0] if '.' in c.nombre else c.nombre[:1]
        print(f"  [{letra}] {c.nombre}")
        # Mostrar primeros 3 campos como preview
        preview = list(c.campos.items())[:3]
        for campo, valor in preview:
            val_short = valor[:60] + "..." if len(valor) > 60 else valor
            print(f"      • {campo}: {val_short}")
        print()


def seleccionar_caso_interactivo(casos: List[CasoUso]) -> CasoUso:
    """Menú interactivo para elegir caso."""
    listar_casos(casos)

    # Mapear letras a casos
    letra_map = {}
    for c in casos:
        letra = c.nombre.split('.')[0].strip().upper() if '.' in c.nombre else c.nombre[0].upper()
        letra_map[letra] = c

    while True:
        choice = input("👉 Selecciona caso (A/B/C/D/E) o 'q' para salir: ").strip().upper()
        if choice == 'Q':
            print("👋 Cancelado.")
            sys.exit(0)
        if choice in letra_map:
            return letra_map[choice]
        print(f"  ❌ Opción inválida. Usa: {', '.join(sorted(letra_map.keys()))}")


# =============================================================================
# MAIN
# =============================================================================
def main():
    parser = argparse.ArgumentParser(
        description="Autocompleta Canvas Loop Engineering desde Casos de Uso",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python autofill_canvas.py                    # Modo interactivo
  python autofill_canvas.py --case A           # Caso A directo
  python autofill_canvas.py --case C -o mi_canvas.csv  # Caso C salida custom
  python autofill_canvas.py --list             # Solo listar casos
        """
    )
    parser.add_argument('--case', '-c', choices=['A', 'B', 'C', 'D', 'E'],
                        help='Caso a usar directamente (A-E)')
    parser.add_argument('--output', '-o', type=Path,
                        default=DEFAULT_OUTPUT,
                        help=f'Archivo de salida (default: {DEFAULT_OUTPUT.name})')
    parser.add_argument('--list', '-l', action='store_true',
                        help='Listar casos disponibles y salir')
    parser.add_argument('--quiet', '-q', action='store_true',
                        help='Modo silencioso (menos output)')
    parser.add_argument('--casos-csv', type=Path, default=CASOS_CSV,
                        help='Ruta a CASOS_DE_USO.csv')
    parser.add_argument('--canvas-csv', type=Path, default=CANVAS_TEMPLATE_CSV,
                        help='Ruta a CANVAS template CSV')

    args = parser.parse_args()

    verbose = not args.quiet

    # Verificar archivos
    for path, name in [(args.casos_csv, "Casos de Uso"), (args.canvas_csv, "Canvas Template")]:
        if not path.exists():
            print(f"❌ No se encuentra {name}: {path}")
            print(f"   Asegúrate de estar en la carpeta correcta o usa --casos-csv / --canvas-csv")
            sys.exit(1)

    # Cargar datos
    if verbose:
        print(f"📂 Leyendo casos de uso: {args.casos_csv.name}")
    casos = leer_casos_uso(args.casos_csv)

    if not casos:
        print("❌ No se encontraron casos en el CSV")
        sys.exit(1)

    if args.list:
        listar_casos(casos)
        sys.exit(0)

    if verbose:
        print(f"📂 Leyendo template Canvas: {args.canvas_csv.name}")
    canvas_rows = leer_canvas_template(args.canvas_csv)

    # Seleccionar caso
    if args.case:
        letra = args.case.upper()
        caso = next((c for c in casos if c.nombre.split('.')[0].strip().upper() == letra), None)
        if not caso:
            print(f"❌ Caso {letra} no encontrado. Disponibles: {[c.nombre.split('.')[0] for c in casos]}")
            sys.exit(1)
        if verbose:
            print(f"🎯 Usando caso: {caso.nombre}")
    else:
        caso = seleccionar_caso_interactivo(casos)
        if verbose:
            print(f"🎯 Caso seleccionado: {caso.nombre}")

    # Autocompletar
    if verbose:
        print("\n🔄 Autocompletando Canvas...")
    canvas_rows, mapeados, defaults = autocompletar_canvas(canvas_rows, caso, verbose=verbose)

    # Guardar
    args.output.parent.mkdir(parents=True, exist_ok=True)
    escribir_canvas(args.output, canvas_rows)

    # Resumen
    print(f"\n✅ ¡Canvas generado!")
    print(f"   📄 Archivo: {args.output}")
    print(f"   🔗 Campos mapeados desde caso: {mapeados}")
    print(f"   📝 Defaults aplicados: {defaults}")
    print(f"   📊 Total filas en Canvas: {len(canvas_rows)}")

    if verbose:
        print(f"\n💡 Próximos pasos:")
        print(f"   1. Abre {args.output.name} en Excel/Google Sheets")
        print(f"   2. Completa campos con '[Completar:...]' o '[Medir:...]'")
        print(f"   3. Usa LOOP_ENGINEERING_LOG_ITERACIONES.csv para trackear ciclos")
        print(f"   4. Consulta LOOP_ENGINEERING_TRADUCCION_HUMANA.csv para modo práctico")


if __name__ == "__main__":
    main()