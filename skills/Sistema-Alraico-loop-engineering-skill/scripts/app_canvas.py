#!/usr/bin/env python3
"""
=============================================================================
LOOP ENGINEERING CANVAS — Web App (Streamlit)
=============================================================================
App web para autocompletar el Canvas desde Casos de Uso.

Ejecución:
    streamlit run app_canvas.py

Requisitos:
    pip install streamlit pandas
=============================================================================
"""

import streamlit as st
import pandas as pd
import io
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass


# =============================================================================
# CONFIGURACIÓN DE PÁGINA
# =============================================================================
st.set_page_config(
    page_title="Loop Engineering Canvas - Autocompletar",
    page_icon="🔄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #2E86C1 0%, #16A085 100%);
        padding: 1.5rem;
        border-radius: 10px;
        color: white;
        margin-bottom: 2rem;
    }
    .case-card {
        background: #f8f9fa;
        border-left: 4px solid #2E86C1;
        padding: 1rem;
        border-radius: 5px;
        margin: 0.5rem 0;
    }
    .metric-box {
        background: #E8F8F5;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
    }
    .success-box {
        background: #E8F8F5;
        border: 1px solid #27AE60;
        padding: 1rem;
        border-radius: 8px;
    }
    .info-box {
        background: #D6EAF8;
        border: 1px solid #2E86C1;
        padding: 1rem;
        border-radius: 8px;
    }
    .stButton > button {
        background: linear-gradient(90deg, #2E86C1 0%, #16A085 100%);
        color: white;
        border: none;
        border-radius: 5px;
        padding: 0.5rem 2rem;
        font-weight: bold;
    }
    .stButton > button:hover {
        background: linear-gradient(90deg, #1A6B9C 0%, #12876F 100%);
    }
</style>
""", unsafe_allow_html=True)


# =============================================================================
# CONSTANTES Y MAPEOS (igual que script CLI)
# =============================================================================
CAMPO_MAPEO = {
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Umbral k (crítico)"): "y-CARMIS k",
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Protocolo de reconfiguración"): "Choque",
    ("1. y-CARMIS — SOBRECARGA Y RECONFIGURACIÓN", "Nueva estabilidad esperada (métricas)"): "Métrica éxito",
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Límites activos (marcar)"): "Límites dominantes",
    ("2. LÍMITES COGNITIVOS — DIAGNÓSTICO POSICIONAL", "Intervención prioritaria"): "Choque",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Transducción"): "Transducción",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Verificación triaxial"): "Verificación triaxial",
    ("3. TRANSDUCCIÓN — ENTRE DOMINIOS", "Intervención en Y"): "Choque",
    ("5. ECROx — MAPEO", "Ecrox actuales (notación I/C-M/P-Per/Gen-V/F)"): "Ecrox clave",
    ("5. ECROx — MAPEO", "Intervención y-CARMIS diseñada"): "Choque",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Sesgo detectado"): "Sesgo",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Choque programado diseñado"): "Choque",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Acción concreta"): "Choque",
    ("7. SESGOS — CHOQUES PROGRAMADOS", "Métrica de éxito"): "Métrica éxito",
}

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
# FUNCIONES CORE
# =============================================================================
@st.cache_data
def load_default_casos() -> pd.DataFrame:
    """Carga el CSV de casos de uso por defecto."""
    try:
        return pd.read_csv("LOOP_ENGINEERING_CASOS_USO.csv", encoding='utf-8-sig')
    except FileNotFoundError:
        return None


@st.cache_data
def load_default_canvas() -> pd.DataFrame:
    """Carga el template de Canvas por defecto."""
    try:
        return pd.read_csv("LOOP_ENGINEERING_WORKSHEET_CANVAS.csv", encoding='utf-8-sig')
    except FileNotFoundError:
        return None


def parse_casos(df: pd.DataFrame) -> Dict[str, Dict[str, str]]:
    """Parsea el DataFrame de casos a dict {caso: {campo: valor}}."""
    casos = {}
    for _, row in df.iterrows():
        caso_name = str(row.get('Caso', '')).strip()
        campo = str(row.get('Campo', '')).strip()
        contenido = str(row.get('Contenido Pre-llenado', '')).strip()
        if caso_name and campo and contenido and contenido != 'nan':
            if caso_name not in casos:
                casos[caso_name] = {}
            casos[caso_name][campo] = contenido
    return casos


def parse_canvas_template(df: pd.DataFrame) -> pd.DataFrame:
    """Asegura que el template tenga las columnas correctas."""
    required = ['Sección', 'Campo', 'Valor/Entrada', 'Notas', 'Check']
    for col in required:
        if col not in df.columns:
            df[col] = ''
    return df[required]


def autocompletar_canvas(canvas_df: pd.DataFrame, caso_data: Dict[str, str]) -> Tuple[pd.DataFrame, int, int]:
    """Rellena el canvas con datos del caso seleccionado."""
    canvas = canvas_df.copy()
    mapeados = 0
    defaults_aplicados = 0

    # Crear índice para búsqueda rápida
    canvas_idx = {}
    for i, row in canvas.iterrows():
        key = (str(row['Sección']).strip(), str(row['Campo']).strip())
        canvas_idx[key] = i

    # 1. Mapeo directo desde caso de uso
    for (seccion, campo), campo_caso in CAMPO_MAPEO.items():
        if (seccion, campo) in canvas_idx and campo_caso in caso_data:
            idx = canvas_idx[(seccion, campo)]
            canvas.at[idx, 'Valor/Entrada'] = caso_data[campo_caso]
            canvas.at[idx, 'Check'] = "✅"
            mapeados += 1

    # 2. Aplicar defaults
    for (seccion, campo), default_fn in DEFAULTS.items():
        if (seccion, campo) in canvas_idx:
            idx = canvas_idx[(seccion, campo)]
            current = str(canvas.at[idx, 'Valor/Entrada']).strip()
            if not current or current.startswith("["):
                val = default_fn() if callable(default_fn) else default_fn
                canvas.at[idx, 'Valor/Entrada'] = val
                defaults_aplicados += 1

    return canvas, mapeados, defaults_aplicados


def df_to_csv_bytes(df: pd.DataFrame) -> bytes:
    """Convierte DataFrame a bytes CSV para descarga."""
    buffer = io.StringIO()
    df.to_csv(buffer, index=False, encoding='utf-8-sig')
    return buffer.getvalue().encode('utf-8-sig')


# =============================================================================
# INTERFAZ STREAMLIT
# =============================================================================

def render_header():
    """Renderiza cabecera principal."""
    st.markdown("""
    <div class="main-header">
        <h1>🔄 Loop Engineering Canvas — Autocompletar</h1>
        <p>Genera tu Canvas pre-llenado desde Casos de Uso del Sistema Alráico</p>
    </div>
    """, unsafe_allow_html=True)


def render_sidebar():
    """Renderiza barra lateral con carga de archivos."""
    with st.sidebar:
        st.header("⚙️ Configuración")

        # Cargar archivos por defecto
        default_casos = load_default_casos()
        default_canvas = load_default_canvas()

        st.subheader("📁 Archivos CSV")

        # Casos de Uso
        casos_file = st.file_uploader(
            "Casos de Uso (LOOP_ENGINEERING_CASOS_USO.csv)",
            type=['csv'],
            help="CSV con casos A-E y sus campos pre-llenados"
        )
        if casos_file:
            casos_df = pd.read_csv(casos_file, encoding='utf-8-sig')
            st.success(f"✅ Cargado: {len(casos_df)} filas")
        elif default_casos is not None:
            casos_df = default_casos
            st.info(f"📂 Usando archivo por defecto ({len(casos_df)} filas)")
        else:
            casos_df = None
            st.warning("⚠️ Sube Casos de Uso o ten el archivo en la carpeta")

        # Canvas Template
        canvas_file = st.file_uploader(
            "Template Canvas (LOOP_ENGINEERING_WORKSHEET_CANVAS.csv)",
            type=['csv'],
            help="Template base del Canvas (70 filas)"
        )
        if canvas_file:
            canvas_df = pd.read_csv(canvas_file, encoding='utf-8-sig')
            st.success(f"✅ Cargado: {len(canvas_df)} filas")
        elif default_canvas is not None:
            canvas_df = default_canvas
            st.info(f"📂 Usando template por defecto ({len(canvas_df)} filas)")
        else:
            canvas_df = None
            st.warning("⚠️ Sube Template Canvas o ten el archivo en la carpeta")

        st.divider()

        # Info del sistema
        with st.expander("ℹ️ Sobre esta app"):
            st.markdown("""
            **Loop Engineering Canvas** — Herramienta basada en el Sistema Alráico (Amid Dabir, CC0 1.0).

            **Funciona así:**
            1. Subes/usas los CSVs de Casos de Uso y Template
            2. Eliges un caso (A-E)
            3. La app mapea 12 campos + aplica 23 defaults inteligentes
            4. Descargas el Canvas listo para trabajar

            **Casos disponibles:**
            - **A**: Bloqueo creativo / Innovación
            - **B**: Decisión estratégica bajo incertidumbre
            - **C**: Conflicto relacional / Equipo
            - **D**: Debugging / Problema técnico complejo
            - **E**: Diseño de sistema / Arquitectura
            """)

        return casos_df, canvas_df


def render_case_selector(casos_dict: Dict[str, Dict[str, str]]) -> Optional[str]:
    """Renderiza selector de caso con cards visuales."""
    st.subheader("🎯 Selecciona tu Caso Base")

    # Extraer letras A-E
    case_letters = {}
    for name in casos_dict.keys():
        letter = name.split('.')[0].strip().upper() if '.' in name else name[0].upper()
        case_letters[letter] = name

    # Cards en columnas
    cols = st.columns(5)
    selected = None

    for i, (letter, full_name) in enumerate(sorted(case_letters.items())):
        with cols[i]:
            caso_data = casos_dict[full_name]
            with st.container():
                st.markdown(f"""
                <div class="case-card">
                    <h4>[{letter}]</h4>
                    <strong>{full_name.split('.', 1)[1].strip() if '.' in full_name else full_name}</strong>
                </div>
                """, unsafe_allow_html=True)

                # Preview campos clave
                key_fields = ['y-CARMIS k', 'Límites dominantes', 'Sesgo']
                for kf in key_fields:
                    if kf in caso_data:
                        val = caso_data[kf][:80] + "..." if len(caso_data[kf]) > 80 else caso_data[kf]
                        st.caption(f"**{kf}:** {val}")

                if st.button(f"Usar Caso {letter}", key=f"btn_{letter}", use_container_width=True):
                    selected = full_name

    return selected


def render_canvas_preview(canvas_df: pd.DataFrame, mapeados: int, defaults: int):
    """Renderiza preview del canvas generado."""
    st.subheader("👀 Preview del Canvas Generado")

    # Métricas
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Filas Totales", len(canvas_df))
    with col2:
        st.metric("✅ Mapeados del Caso", mapeados)
    with col3:
        st.metric("📝 Defaults Aplicados", defaults)
    with col4:
        pendientes = len(canvas_df[canvas_df['Check'] != '✅'])
        st.metric("⏳ Pendientes (Check ☐)", pendientes)

    # Tabs por sección
    sections = canvas_df['Sección'].unique()
    tabs = st.tabs([str(s)[:30] for s in sections])

    for tab, section in zip(tabs, sections):
        with tab:
            section_df = canvas_df[canvas_df['Sección'] == section].copy()
            # Mostrar solo columnas relevantes
            display_df = section_df[['Campo', 'Valor/Entrada', 'Notas', 'Check']].copy()
            display_df.columns = ['Campo', 'Valor / Entrada', 'Notas / Ayuda', '✓']
            st.dataframe(
                display_df,
                use_container_width=True,
                hide_index=True,
                column_config={
                    "Campo": st.column_config.TextColumn(width="medium"),
                    "Valor / Entrada": st.column_config.TextColumn(width="large"),
                    "Notas / Ayuda": st.column_config.TextColumn(width="medium"),
                    "✓": st.column_config.TextColumn(width="small"),
                }
            )


def render_download(canvas_df: pd.DataFrame, caso_seleccionado: str):
    """Renderiza botón de descarga."""
    st.divider()
    st.subheader("💾 Descargar Canvas")

    csv_bytes = df_to_csv_bytes(canvas_df)
    filename = f"CANVAS_{caso_seleccionado.split('.')[0].strip()}_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"

    st.download_button(
        label="⬇️ Descargar CSV Autocompletado",
        data=csv_bytes,
        file_name=filename,
        mime="text/csv",
        use_container_width=True,
        type="primary"
    )

    st.caption(f"Archivo: `{filename}` — Listo para abrir en Excel, Google Sheets, LibreOffice")


def render_next_steps():
    """Pasos siguientes recomendados."""
    with st.expander("🚀 Próximos Pasos Recomendados", expanded=True):
        st.markdown("""
        ### Una vez descargado el CSV:

        1. **Ábrelo en Excel / Google Sheets / LibreOffice**
           - Separa por comas, codificación UTF-8
           - Cada fila = un campo del Canvas

        2. **Completa los placeholders** (filas con `☐` en columna Check)
           - Busca celdas con `[Completar:...]` o `[Medir:...]`
           - Ej: `Sistema / Objetivo`, `Capacidad actual`, `Problema origen`, etc.

        3. **Inicia tu primer ciclo** en `LOOP_ENGINEERING_LOG_ITERACIONES.csv`
           - Una fila por iteración y-CARMIS
           - Trackea: al, s, y, v, XP_i, k, observaciones

        4. **Usa modo práctico** con `LOOP_ENGINEERING_TRADUCCION_HUMANA.csv`
           - Traduce jerga técnica a lenguaje natural para conversaciones
           - Ej: `al < k` → *"Parece que las piezas no encajan bien"*

        5. **Consulta catálogos** según necesites:
           - `LOOP_ENGINEERING_CATALOGO_LIMITES.csv` — 20 límites con checkboxes
           - `LOOP_ENGINEERING_ECROX_TAXONOMIA.csv` — 16 tipos Ecrox
           - `LOOP_ENGINEERING_ECUACIONES.csv` — 10 fórmulas de referencia
        """)


# =============================================================================
# MAIN APP
# =============================================================================
def main():
    render_header()

    # Sidebar + carga archivos
    casos_df, canvas_template = render_sidebar()

    if casos_df is None or canvas_template is None:
        st.error("📂 **Faltan archivos base**. Sube ambos CSVs en la barra lateral o colócalos en la carpeta de la app.")
        st.stop()

    # Parsear datos
    casos_dict = parse_casos(casos_df)
    canvas_df = parse_canvas_template(canvas_template)

    if not casos_dict:
        st.error("❌ No se pudieron parsear casos del CSV. Verifica formato (columnas: Caso, Campo, Contenido Pre-llenado)")
        st.stop()

    # Selector de caso
    caso_seleccionado = render_case_selector(casos_dict)

    if caso_seleccionado is None:
        st.info("👈 Selecciona un caso arriba para generar tu Canvas")
        st.stop()

    # Generar canvas
    caso_data = casos_dict[caso_seleccionado]
    canvas_completo, mapeados, defaults = autocompletar_canvas(canvas_df, caso_data)

    # Mostrar resultado
    st.success(f"✅ Canvas generado para **{caso_seleccionado}**")

    render_canvas_preview(canvas_completo, mapeados, defaults)
    render_download(canvas_completo, caso_seleccionado)
    render_next_steps()


if __name__ == "__main__":
    main()