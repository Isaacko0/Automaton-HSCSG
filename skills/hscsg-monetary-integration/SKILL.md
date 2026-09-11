---
name: hscsg-monetary-integration
description: "Integración profunda de sistemas monetarios alternativos y democracia económica en documentos HSCSG. Extrapola principios de Moneda Libre G1, Túmin, Moneda PAR, Bitcoin, Stablecoins soberanas y otros referentes a la arquitectura ZCS/ZNU sin limitarse a copiar modelos."
version: 1.0.0
author: HSCSG + Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hscsg, monetary-integration, g1, tumin, par, zcs, currency, sovereignty]
    related_skills: [hermes-agent]
---

# HSCSG Monetary Integration

Skill especializada en integrar referentes de sistemas monetarios alternativos en el documento `modelo-negocio-objetivos-civilizatorios-hscsg.md` y sus derivados. No se limita a describir las referencias: infiere, extrapola y adapta sus principios estructurales a la arquitectura ZCS/ZNU de HSCSG.

## Cuándo usar esta skill

- Integrar nuevos referentes monetarios/alternativos en documentos HSCSG.
- Ampliar secciones de arquitectura monetaria, métricas, riesgos o glosario.
- Actualizar la taxonomía de principios monetarios no negociables.
- Vincular sistemas de trueque, crédito circular o emisión democrática al modelo de negocio HSCSG.
- Limpiar y verificar la integración post-parche.

## Flujo de trabajo estandarizado

### 1. Leer el documento base
```bash
read_file("C:\\Users\\Isaacko0\\modelo-negocio-objetivos-civilizatorios-hscsg.md", offset=1, limit=200)
```
Ajustar `offset` según la sección objetivo (891+ para arquitectura monetaria, 1034+ para glosario).

### 2. Identificar referentes externos
Buscar información actualizada sobre el referente (web_search, web_extract, PDFs si están accesibles como texto).

Referentes válidos (lista viva, agregar según necesidad):
- Moneda Libre G1 (Juna)
- Túmin
- Moneda PAR
- Bitcoin / Lightning Network
- Stablecoins soberanas
- Bancos de tiempo
- Complementary currencies regionales
- Sistemas de crédito circular

### 3. Extraer principios estructurales
Para cada referente, identificar:
1. Mecanismo de emisión
2. Unidad de cuenta
3. Regla de circulación
4. Gobernanza
5. Relación con moneda oficial
6. Mitigación de fuga de valor
7. Tratamiento del interés/deuda

**Regla de extrapolación:** No copiar la forma concreta; traducir al lenguaje HSCSG (ZNU, ZCS, Demurrage, ValueFlows, Asambleas de Nodos, Fondo Solarpunk).

### 4. Integrar en secciones objetivo

Modificar en orden de prioridad:

| Sección | Acción |
|---------|--------|
| 14. ARQUITECTURA MONETARIA CIVILIZATORIA | Actualizar introducción y marco de referencia |
| Tabla de principios (14.1) | Agregar fila por referente |
| 14.2 ZCS | Ampliar con nuevo referente |
| 14.3 Arquitectura financiera dual | Integrar flujos nuevos |
| 14.4 ValueFlows | Agregar tipos de transacción |
| 14.5 Principios no negociables | Verificar consistencia |
| 14.6 Métricas monetarias | Agregar KPIs específicos |
| 14.7 Riesgos monetarios | Agregar riesgos del nuevo referente |
| 14.8 Integración con La Cuaternidad Soberana | Vincular a herramienta/conocimiento/confianza/autómata |
| ANEXO: GLOSARIO | Agregar términos nuevos |

### 5. Verificar y limpiar
- Buscar artefactos de formato (`|||`) y corregir.
- Verificar que no haya encabezados duplicados.
- Confirmar que el glosario no tenga filas rotas.
- Validar que las métricas tengan formato de tabla consistente.

## Principios de extrapolación HSCSG

### De Moneda Libre G1
- Creación democrática → Dividendo Soberano Inicial / Emisión asamblearia
- DU (Dividendo Universal) → Partes por millón del total ZNU en circulación
- Valor relativo, no absoluto → Métricas de participación proporcional
- Sin interés ni deuda perpetua → Inversiones del Fondo Solarpunk como conversión, no préstamo

### De Túmin
- Circuito cerrado → Zona de Circulación Soberana (ZCS)
- Moneda no oficial ni obligatoria → Coexistencia provisional con moneda-Estado
- Gobernanza comunitaria → Asambleas de nodos deciden emisión/demurrage
- Aceptación multisectorial → trueque tokenizado en ZCS

### De Moneda PAR
- Trueque sin interés → ValorFlows + byproducts comunitarios
- Crédito circular → Deuda no perpetua, vencimiento flexible
- Bancos de tiempo → ZCS con equivalencia 1:1 tiempo/servicio ↔ ZNU

### De Bitcoin / Lightning
- Proof-of-work como soberanía computacional → No aplica directamente (HSCSG usa proof-of-contribution)
- Escasez programada → Límite constitucional de emisión anual
- Red mesh descentralizada → DTN + nodos Cosateca

### De Stablecoins soberanas
- Paridad territorial → Oráculo local de paridad ZNU/USDC
- Reservas en moneda oficial → Puente fiduciario ↔ ZNU
- Evitar volatilidad → Ajuste semanal por capacidad de pago del territorio

## Métricas monetarias estándar (plantilla)

| Métrica | Definición | Target |
|---------|------------|--------|
| Cobertura ZCS | % transacciones en ZNU | 80% Fase C |
| Velocidad de circulación ZNU | Transacciones por ZNU/año | >12 |
| Índice de demurrage efectivo | % ZNU convertido en Fondo Acceso | 5-10% anual |
| Brecha de fuga | USDC que sale vs ZNU que circula | -50% año/sobre año |
| Accesibilidad monetaria | % miembros con wallet soberana | 100% |
| Volumen de trueque ZCS | Intercambios registrados/mes/nodo | >50 |
| Índice de reciprocidad | Trueques liquidados en especie/tiempo | >60% Fase C |
| Deuda perpetua ZCS | Trueques con saldo negativo >12 meses | 0 |

## Glosario mínimo (términos monetarios)

| Término | Definición |
|---------|-----------|
| Moneda Libre (G1 / Juna) | Experimento de moneda libre originado en Francia (2017). DU, creación igualitaria sin interés. |
| Dividendo Universal (DU) | Unidad relativa en G1; cada miembro recibe misma porción de nueva moneda. |
| Túmin | Moneda complementaria local mexicana (1:1 MXN), circuito cerrado, gobernanza comunitaria. |
| Moneda PAR | Red de trueque comunitario colombiana sin interés ni acumulación. |
| ZCS | Zona de Circulación Soberana: espacio económico cerrado donde opera ZNU. |
| ZNU | Unidad de Soberanía: moneda de acceso/contribución en ZCS. |
| ValueFlows | Stack de economía de regalos ampliado a operaciones monetarias soberanas. |
| Demurrage | Desincentivo a la acumulación; ZNU acumulada se convierte en Fondo Acceso. |
| Oráculo de paridad local | Mecanismo que ajusta ZNU/USDC por territorio, no por mercado global. |
| Crédito circular | Sistema donde cada entrega lleva recepción futura en especie/servicio. |

## Scripts helper

### `scripts/integrate_reference.py`
Parsea referentes y aplica modificaciones al documento HSCSG con detección de duplicados.

Uso:
```bash
python scripts/integrate_reference.py --referente <nombre> --doc <ruta>
```

### `scripts/verify_hscsg.py`
Verifica integridad del documento post-modificación:
- Detecta artefactos OUT-OF-BAND
- Verifica encabezados únicos
- Valida tablas monetarias
- Reporta líneas y tamaño

## Notas de implementación

- Siempre leer `offset=891` antes de modificar arquitectura monetaria.
- Usar `patch` con contexto amplio (3-5 líneas) para evitar falsas coincidencias en tablas.
- Para modificar tablas grandes, preferir `execute_code` con scripts Python sobre `patch` directo.
- Documentar cada nuevo referente en `references/monetary-integrations.md`.
- Mantener `version` del documento en el encabezado HSCSG.

## Historial de integraciones

- v1.6: Moneda PAR integrada como tercer referente.
- v1.x: G1 y Túmin como base de sección 14.
- Próximo: Bitcoin/Lightning, Stablecoins soberanas, Bancos de tiempo regionales.
