# LOOP ENGINEERING WORKSHEET — Guía de Uso (Formato CSV)

## 📁 Archivos Incluidos

| Archivo | Descripción | Uso Principal |
|---------|-------------|---------------|
| `LOOP_ENGINEERING_WORKSHEET_CANVAS.csv` | **Canvas principal** — 48 campos editables + checklist DoD | Hoja de trabajo central por caso/problema |
| `LOOP_ENGINEERING_LOG_ITERACIONES.csv` | **Log de ciclos** — 30 filas para trackear iteraciones | Seguimiento temporal de cada ciclo y-CARMIS |
| `LOOP_ENGINEERING_CATALOGO_LIMITES.csv` | **Catálogo 20 límites** — Referencia + checkbox de detección | Diagnóstico rápido de límites activos |
| `LOOP_ENGINEERING_TRADUCCION_HUMANA.csv` | **Traducción técnico→humano** — 15 equivalencias | Modo práctico/conversacional |
| `LOOP_ENGINEERING_CASOS_USO.csv` | **5 plantillas pre-llenadas** — Bloqueo creativo, Decisión, Conflicto, Debug, Arquitectura | Inicio rápido por tipología de problema |
| `LOOP_ENGINEERING_ECROX_TAXONOMIA.csv` | **16 tipos Ecrox** — Taxonomía completa con intervenciones | Mapeo de configuraciones mentales/sistémicas |
| `LOOP_ENGINEERING_ECUACIONES.csv` | **10 ecuaciones operativas** — Referencia mathemática | Cálculo y verificación de variables |

---

## 🚀 Inicio Rápido (3 pasos)

### 1. **Elige tu modo**
- **Modo Técnico**: Usa `CANVAS.csv` completo + `LOG_ITERACIONES.csv`
- **Modo Práctico/Humano**: Usa `TRADUCCION_HUMANA.csv` + `CASOS_USO.csv` + lenguaje natural

### 2. **Selecciona caso base** (en `CASOS_USO.csv`)
| Si tu problema es... | Usa plantilla... |
|----------------------|------------------|
| Bloqueo creativo, "no se me ocurre nada" | **A. BLOQUEO CREATIVO** |
| Decisión estratégica con incertidumbre | **B. DECISIÓN ESTRATÉGICA** |
| Conflicto interpersonal/equipo | **C. CONFLICTO RELACIONAL** |
| Bug técnico complejo, debugging | **D. DEBUGGING** |
| Diseño de sistema/arquitectura | **E. ARQUITECTURA** |

### 3. **Copia la plantilla a `CANVAS.csv`**
- Fila por fila, transfiere los campos pre-llenados de `CASOS_USO.csv` → `CANVAS.csv`
- Completa los campos vacíos (Tus Notas, Check)
- Registra cada ciclo en `LOG_ITERACIONES.csv`

---

## 🔄 Flujo de Trabajo por Ciclo (y-CARMIS)

```
CICLO N
├─ 1. DETECCIÓN (5 min)
│   ├─ Mide: XP_i actual, al, s, y, v, k
│   ├─ Marca límites activos en CATALOGO_LIMITES.csv
│   └─ Identifica capa dominante + palanca sistémica
│
├─ 2. DIAGNÓSTICO (10-20 min)
│   ├─ Transduce: € modelo + punto C + dominio Y (CANVAS Sección 3)
│   ├─ Verifica triaxial: Mental/Sim/Lab (CANVAS Sección 4)
│   └─ Conceptualiza terms clave si hay ambigüedad (Sección 6)
│
├─ 3. INTERVENCIÓN (Variable)
│   ├─ Diseña choque programado para sesgo dominante (Sección 7)
│   ├─ Ejecuta micro-acción no-racional (máx 15 min)
│   └─ Registra en LOG_ITERACIONES.csv
│
├─ 4. MEDICIÓN POST (2 min)
│   ├─ Re-mide: al, s, y, v, XP_i
│   ├─ ¿al > k y estable? → CONSOLIDAR
│   └─ ¿al < k o inestable? → VOLVER A PASO 1 (nuevo ciclo)
│
└─ 5. CONSOLIDACIÓN (al > k estable)
    ├─ Documenta nuevo Ecrox estable
    ├─ Extrae principios transferibles
    ├─ Crea anti-regla anti-recurrencia
    └─ Comparte como caso epistemológico
```

---

## 📊 Variables Clave (KPIs) — Qué Medir y Cómo

| Variable | Símbolo | Rango | Cómo Medir (Ejemplos) | Meta |
|----------|---------|-------|----------------------|------|
| **Armonía sistémica** | `al` | 0 → 1+ | Coherencia componentes: "¿Qué tan bien encajan las piezas?" (1-10) | `> k_sist` |
| **Sincronía** | `s` | 0 → 1 | Coordinación interna: "¿Todo tira en misma dirección?" (1-10) | `> 0.6` |
| **Ligadura (realidad)** | `y` | 0 → 1 | Conexión con datos inherentes: "¿Esto toca tierra real?" (1-10) | `> 0.7` |
| **Estibación (rigidez)** | `v` | Bajo→Alto | "¿Das vueltas en lo mismo sin tocar tierra?" (Inverso: 10 = bajo) | Baja/Media |
| **Carga entrada** | `XP_i` | 0 → ∞ | Items en memoria trabajo, tareas paralelas, estrés percibido (1-100) | `< k` |
| **Umbral crítico** | `k` | Definido por sistema | Capacidad máxima antes de ruptura (calibrar por contexto) | — |

**Método rápido**: Escala 1-10 para cada una → Divide /10 → Obtienes 0.0-1.0

---

## 🎯 Modo Práctico (Sin Símbolos) — Guía de Conversación

En lugar de lenguaje técnico, usa las traducciones de `TRADUCCION_HUMANA.csv`:

| Situación | Di Esto (Humano) | En Lugar De (Técnico) |
|-----------|------------------|----------------------|
| Inicio diagnóstico | "Parece que las piezas no encajan bien" | `al < k` |
| Usuario abrumado | "No estás roto, estás en reorganización" | `y-CARMIS activado / L9` |
| Usuario repite patrones viejos | "Estás usando un mapa viejo para territorio nuevo" | `HD en patrones / L7` |
| Usuario da vueltas conceptuales | "Das vueltas sobre lo mismo sin tocar tierra" | `v alta / L6` |
| Usuario evita conversación difícil | "Tu mente busca calma rápida, no verdad" | `FCP activo` |
| Usuario ignora consecuencias tardías | "El costo viene después, por eso no lo ves" | `TAD activo` |
| Usuario fusionado con problema | "No eres tu problema, tienes un patrón" | `L14 Identidad sintomática` |
| Meta de intervención | "Las piezas encajan y el sistema fluye" | `al > k estable` |

---

## 🛠️ Cómo Abrir/Editar

### Excel / LibreOffice / Google Sheets
```
1. Archivo → Importar → Seleccionar CSV
2. Separador: Coma (,)
3. Codificación: UTF-8
4. ¡Listo! Cada archivo = una hoja
```

### Python (pandas)
```python
import pandas as pd

canvas = pd.read_csv('LOOP_ENGINEERING_WORKSHEET_CANVAS.csv')
log = pd.read_csv('LOOP_ENGINEERING_LOG_ITERACIONES.csv')
limites = pd.read_csv('LOOP_ENGINEERING_CATALOGO_LIMITES.csv')
# ... etc
```

### Línea de comandos (ver rápido)
```bash
# Ver canvas principal
cat LOOP_ENGINEERING_WORKSHEET_CANVAS.csv | column -t -s,

# Filtrar límites detectados
grep ",Sí$" LOOP_ENGINEERING_CATALOGO_LIMITES.csv

# Ver próximo ciclo vacío en log
awk -F, '$2==""' LOOP_ENGINEERING_LOG_ITERACIONES.csv | head -1
```

---

## 📝 Personalización

### Agregar nuevo caso de uso
1. Abre `LOOP_ENGINEERING_CASOS_USO.csv`
2. Añade filas siguiendo formato: `Caso,Campo,Contenido,Tus Notas,Check`
3. Usa como plantilla base next time

### Añadir métricas custom
1. Edita `LOOP_ENGINEERING_WORKSHEET_CANVAS.csv` (Sección 8)
2. Añade filas: `MÉTRICAS,Tu Métrica,Meta: X | Actual:, ,☐`
3. Añade columna en `LOG_ITERACIONES.csv` si quieres trackear histórico

### Modificar taxonomía Ecrox
1. Edita `LOOP_ENGINEERING_ECROX_TAXONOMIA.csv`
2. Los 16 tipos = combinaciones 2^4 (Nivel × Tipo × Foco × Validez)
3. Mantén consistencia: I/C, P/M, Per/Gen, V/F

---

## ⚠️ Reglas de Seguridad (Hard Constraints)

**NUNCA violes estas reglas — derivación inmediata si se activan:**

| Nivel | Trigger | Acción Obligatoria |
|-------|---------|-------------------|
| **5 - CRISIS** | Mención autolesión, suicidio, ideación violenta, psicosis, pánico severo, sustancias riesgo vital | 1. Validar: "Entiendo que es muy difícil" 2. Priorizar seguridad 3. **Derivar YA**: 988 (México) / 024 (España) / 988 (US) / 911 local 4. Acompañar hasta transferencia |

**Reglas de operación IA (siempre):**
- ❌ NO diagnosticar médico/psiquiátrico
- ❌ NO sustituir terapeuta humano
- ❌ NO crear dependencia ("solo yo entiendo")
- ❌ NO forzar reconfiguración identitaria profunda
- ❌ NO juzgar valor sustancial sobre personas reales
- ✅ SÍ: Señalar patrones observables, ofrecer perspectivas, guiar auto-observación, facilitar micro-acciones, validar reorg natural

---

## 🔁 Metabucle: Evoluciona la Propia Worksheet

Cada 10 ciclos o cambio de dominio mayor:

```
☐ Revisa CANVAS completo: ¿qué campos uso/nunca uso?
☐ Aplica Conceptualización (Sección 6) a términos de la worksheet
☐ Verifica triaxial: ¿Mental (coherente)? ¿Sim (modelable)? ¿Lab (útil real)?
☐ Genera v+1: añade/quita campos, actualiza casos uso, refina traducciones
☐ Crea anti-regla: "Esta worksheet no es dogma, es andamio"
☐ Comparte versión mejorada como caso epistemológico
```

---

## 📄 Licencia y Atribución

Basado en **Sistema Alráico Modo Compacto 3** — Amid Dabir (CC0 1.0 Universal)
- Libre uso, modificación, compartición sin restricciones
- Esta worksheet es un € (conjunto creeófilo) sujeto a su propio y-CARMIS
- *"Lo barato sale caro" — Inversión inicial de rigor ahorra infinitos reworks*

---

## 🆘 Soporte / Dudas

- **Archivo maestro Alráico**: `Sistema Alráico Modo compacto 3.txt` (en misma carpeta)
- **Plantilla Markdown completa**: `PLANTILLA_INGENIERIA_BUCLES_ALRAICA.md`
- **Contacto autor Alráico**: Amiddabir@gmail.com
- **Recursos Drive**: [Carpeta Sistema Alráico](https://drive.google.com/drive/folders/160c0rvEszbYFliBa3pfouBbI2caf-iCi)

---

*Versión 1.0 — Sujeta a evolución continua via y-CARMIS propio*