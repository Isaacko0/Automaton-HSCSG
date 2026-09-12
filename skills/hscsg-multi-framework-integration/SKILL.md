---
name: hscsg-multi-framework-integration
description: Integración multi-framework en documentos fundacionales HSCSG. Aplica cuando se necesita integrar un marco externo (DisCO, 8 Formas de Capital, Integral Collective, Auravana, etc.) en el documento base HSCSG manteniendo coherencia estructural, indexación, glosario y consistencia multi-capital.
license: MIT
metadata:
  author: Zeitnus
  version: 0.1.0
---

# HSCSG Multi-Framework Integration

Integra marcos teóricos externos en el documento fundacional HSCSG sin romper estructura, indexación, numeración ni glosario.

## Cuando usar
- Agregar un nuevo framework de referencia (DisCO, Permacultura, Teoría Integral, etc.)
- Actualizar el documento base `BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md` (raíz de `HSCSG_v15_OS`) con nueva teoría operativa
- Alinear métricas CAC/MCI/ICS con nuevas dimensiones
- Insertar secciones nuevas (2.10, 2.11, etc.) sin estropear índices

🔴 **REGLA OBLIGATORIA**: en cada sesión y tras cada asimilación de repo/proyecto GitHub,
actualizar el BRIEF + los `docs/*_backup.md` / `docs/*_integration.md` y pushear TODO
(`git add -A` → commit → `git push origin master`). El remote usa HTTPS + git-credential-manager;
**jamás** escribir tokens en archivos, commits o salida.

## Núcleo operativo

### 1. Variantes de documento
| Archivo | Uso |
|---------|-----|
| `BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md` | **Documento canónico único** (raíz de `HSCSG_v15_OS`). Todas las integraciones se aplican aquí. |
| `docs/<framework>_backup.md` | Informe quirúrgico del framework fuente (requerido ANTES de integrar) |
| `docs/<framework>_integration.md` | Integración en 3 perspectivas: Usuario · LLM · Proyecto HSCSG |

- **Jamás** renombrar el BRIEF una vez estabilizado.
- El BRIEF vive en la **raíz del repo** `HSCSG_v15_OS` (no fuera del repo).
- Usar copias de trabajo con `copy2` antes de parches grandes; luego commit + push.

### 2. Reglas de inserción (no romper)
1. **Nunca** agregar secciones como appendices sueltas. Insertar en:
   - §2.X = epistemología / marco teórico del framework
   - §3.0 = traducción operativa a La Cuaternidad Soberana
   - §5.6 = subsistemas integrales (CDS-OAD-ITC-COS-FRS) y arquitectura celular
   - §6.1 = métricas CAC/MCI/ICS ampliadas
   - §14.X = monetaria / ZCS / value equation / ValueFlows si aplica
   - §16 = orquestación agéntica / runtimes compatibles
   - §17 = memética / componentes replicables
   - Glosario = todos los términos nuevos
2. **Numeración secuencial**: usar la siguiente §2.X disponible (no saltar números).
3. **Índice**: agregar entrada inmediatamente después del bloque de secciones relacionadas.
4. **Anclas markdown**: usar implícitas (solo `# Título`) — NO usar `{#anchor}`.
5. **Referencias cruzadas**: si un término se menciona en §3.0, debe estar en glosario.
6. **Frameworks productivos/manufactureros** (FABSHIP, FabLab, Earthship, etc.): además de §2.X, inyectar en:
   - §5.1 (Proyectos Base)
   - §5.2 (Componentes Técnicos) + nuevos tipos ValueFlows: `RepairFlow`, `ManufactureFlow`, `DesignFlow`, `RecycleFlow`
   - §5.4 (Roles Integrados) — nuevo rol numerado
   - §5.5 (Revenue Byproducts) — byproducts de fabricación soberana
   - §14.3-14.4 (Arquitectura financiera / ValueFlows)
   - §17 (memética de producción material)
7. **Frameworks de gobernanza económica resource-based** (HUMANIA, etc.): además de §2.X, inyectar en:
   - §14.3 (Resource-Based Pricing como capa del oráculo de paridad local)
   - §14.4 (Value Equation extensiones biofísicas)
   - §17 (memética replicativa Town Zero / mitosis celular)
   - §5.1-5.2 si introduce Automated Essentials → mapear a Agentes Solarpunk
8. **Frameworks conceptuales / críticos / civilizatorios** (Fresco/Venus, Borgese, Crandall, Andreas, etc.): además de §2.X, inyectar en:
   - §5.1-5.2 (proyectos base o componentes técnicos si introduce innovaciones físicas)
   - §14.1 (actualizar marco de referencia monetario/civilizatorio si aplica)
   - §17 (memética soberana) — bullets que materialicen el aporte como práctica replicable
   - §12 (riesgos) si introduce supuestos fundacionales nuevos
   - Glosario — términos nuevos del framework
   - Tabla de referencias — ISBN/URL + sección HSCSG
9. **OCR / PDFs escaneados en Windows**: si pdftotext genera <100 líneas o caracteres de control, el PDF es imagen-escaneada. Instalar Tesseract-OCR v5.5.0 + Poppler, usar PyMuPDF (render 200 DPI) + pytesseract. Rutas con tildes/espacios requieren `glob.glob()` en Windows.

### 3. Checklist genérica de integración de framework

| Check | Sección | Entregable |
|-------|---------|------------|
| Principios/corpus del framework | §2.X | Lista numerada de principios traducidos a soberanía |
| Mapa operativo HSCSG | §3.0 | Párrafo "Vaso comunicante [Framework] ↔ HSCSG" + tabla de mapeo si aplica |
| Subsistema(s) o arquitectura organizacional | §5.6 | Fila en tabla de subsistemas o párrafo de overlay arquitectónico |
| Extensiones ValueFlows / métricas | §3.0 o §14.X | Nuevos tipos de flujo, Value Equation extensiones, métricas MCI ampliadas |
| Métrica ampliada | §6.1 | Pregunta de scoring o tabla multi-capital |
| **Roles/productivos (manufactureros)** | **§5.4** | **Nuevo rol numerado, con campos ValueFlow y financiamiento** |
| **Byproducts económicos** | **§5.5** | **Bloque de byproducts con modelo de distribución** |
| ValueFlows productivos | §3.0 o §14.4 | Nuevos tipos: RepairFlow, ManufactureFlow, DesignFlow, RecycleFlow |
| **Conceptos teóricos / críticos / civilizatorios** | **§2.16, §2.16a-2.16f** | **Tabla homologación §2.X, §17 memética, glosario, referencias integradas** |
| Pricing/gobernanza económica | §14.3 | Resource-Based Pricing, Lateral Scientific Governance, oráculo de paridad extendido |
| Runtime / orquestación / forma organizacional | §16 | Fila en tabla de architectures compatibles |
| Memética | §17 | 1-2 bullets numerados en "Componentes de la memética soberana ampliada" |
| Glosario | § final | Fila por cada término nuevo del framework |
| **Backup del framework original** | **docs/** | **`<framework>_backup.md` — informe exhaustivo fuente (requerido ANTES de integración)** |
| **Integración 3 perspectivas** | **docs/** | **`<framework>_integration.md` — 3 vistas: Usuario · LLM · Proyecto HSCSG** |

**Nota:** frameworks organizacionales (Participatory Commons, Integral) pueden requerir **dos filas en §16** (una como arquitectura organizacional, otra como protocolo económico si aplica).

### 3b. Estrategia de copias de trabajo, commit y push (sin revelar credenciales)
1. **Regla de variante única por framework**: antes de integrar framework N, copiar el BRIEF más reciente estabilizado a `BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md` (ya es la variante única canónica).
2. **Jamás** modificar el BRIEF fuera del repo `HSCSG_v15_OS`; todas las iteraciones ocurren en el archivo en la raíz del repo.
3. **Commit + push por cambio significativo**: `feat: integración <Framework> en HSCSG v15 OS (<sub>)` con mensaje detallando secciones nuevas y cross-references.
4. **Staging explícito**: `git add <archivos modificados>` antes de commit para asegurar que solo entran los archivos previstos.
5. **Push de TODOS los archivos modificados en local**: tras cada sesión de edición, ejecutar `git add -A` (o listar explícitamente los archivos tocados) y `git push origin master` para sincronizar el estado local completo con GitHub. **🔴 REGLA DURA: nunca decir "listo / ya está en GitHub" hasta que el push termine sin error Y `git status --short` quede vacío.** En la sesión real el agente creó `docs/copiosis_*.md` + el BRIEF en disco pero no los pusheó; el usuario tuvo que preguntar "hiciste el commit?". Si el push no sube todo (working tree aún sucio), volver al paso 4. Si no hay red/auth, decirlo explícitamente.
6. **🔒 SEGURIDAD — NUNCA revelar credenciales**:
   - El remote está configurado vía HTTPS + `git-credential-manager` (el token NO está en la URL ni en archivos). El push funciona sin escribir secretos.
   - **Jamás** incluir en el SKILL.md, commits, mensajes, docs o salida al usuario: tokens (`ghp_...`, `github_pat_...`), contraseñas, `client_secret`, URLs con `@token@github.com`, ni rutas a archivos `.env`.
   - Si el push falla por auth, reportar el error genérico y pedir al usuario que verifique el credential manager — **nunca** solicitar ni mostrar el token.
   - El `git remote -v` ya usa `https://github.com/Isaacko0/HSCSG_v15_OS.git` (sin credencial embebida). Mantenerlo así.
7. **Fusión final** (opcional, solo cuando todas las integraciones están congeladas): el BRIEF ya es el documento unificado; no es necesario mergear variantes.

### 4. Validación post-integración

1. **Numeración**: no debe haber números duplicados en top-level sections.
2. **Anclas internas**: todos los `[texto](#slug)` del índice deben coincidir con títulos de sección (slug implícito).
3. **Glosario**: cada término mencionado en cuerpo debe aparecer al menos 1 vez en glosario. Repeticiones en cuerpo son OK.
4. **DisCO-specific** (si aplica): verificar 8 puntos de checklist original.
5. **Participatory Commons** (si aplica): verificar que Social DNA, DHO, current-sees y eco-reintegración aparecen al menos una vez en §2.X y §5.6.
6. **Prosocial Protocol** (si aplica): verificar Food Web, Needs-Driven Economy, Resource Ecology, Planetary Boundary Avoidance en §2.X y §14.1.
7. **FABSHIP/Humania-specific** (si aplica):
   - Earthship 6 vectors mapeados a AUT_* en §2.12
   - FabLab principles listados en §2.12
   - Nuevos tipos ValueFlows declarados en §14.4: `RepairFlow`, `ManufactureFlow`, `DesignFlow`, `RecycleFlow`
   - Rol 6 (FABSHIP) presente en §5.4
   - Byproducts FABSHIP en §5.5
   - Resource-Based Pricing en §14.3
   - Lateral Scientific Governance mapeado a E²R/CDS en §14.4
   - Town Zero HSCSG checks listados en §2.13
   - §17 contiene bullet "FABSHIP como memética de producción material soberana"
8. **Encoding**: UTF-8 limpio, sin caracteres escapados inválidos.
9. **Dupes headings**: no debe haber títulos `###` duplicados.

### 5. Skills relacionados
- `external-framework-integration`: uso genérico de integración de frameworks
- `hscsg-monetary-integration`: integración monetaria específica (G1, Túmin, PAR)
## Referencias
- `references/framework_mappings.md` — Mapeos framework-by-framework con traducción HSCSG de cada concepto (8 Formas, DisCO, Participatory Commons, Prosocial Protocol, Integral, Auravana).
- `references/participatory_commons_terms.md` — Glosario operativo de términos Participatory Commons.
- `references/prosocial_protocol_terms.md` — Glosario operativo de términos Prosocial Coordination Protocol.
## Notas y lecciones aprendidas
- Los anclajes markdown son implícitos en este documento; no usar `{#anchor}` explícito.
- El glosario usa formato `| **Término** | Definición |` — respetar pipe exacto.
- Al parchear §17, asegurar que el texto-ancla coincide EXACTAMENTE (incluyendo numeración: "7." no "6.").
- Si un término del framework aparece 5+ veces en cuerpo pero solo 1 en glosario, está OK; si 0 en glosario, agregarlo.
- Validar anclas de índice ANTES de hacer replace en el índice; el índice tiene formato `- [2.X título](#slug)` con slugs implícitos generados por markdown.
- No renombrar el archivo base una vez estabilizado; usar variantes ` - 8formas.md`, ` - disco.md`, ` - prosocial.md`, etc. para WIP.
- Usar copias de trabajo explícitas (cp o copy2) antes de parches grandes.
- Commits por framework: `feat: integración <Framework> en HSCSG v15 OS`. Tras el commit, **`git push origin master`** para subir TODOS los archivos modificados en local.
- **El BRIEF canónico es `BRIEF_EXHAUSTIVO_HSCSG_COSATECA_OS.md`** en la raíz del repo `HSCSG_v15_OS` (ya no `HSCSG 8 julio2026*.md`). Aplicar todas las integraciones ahí.
- **Nunca** revelar credenciales de GitHub: el remote usa HTTPS + git-credential-manager; el token no se escribe en archivos ni en la salida.
- **Frameworks conceptuales/críticos** (Fresco, Borgese, Crandall, Andreas): adoptar como primitivas de soberanía territorial, no como modelos cerrados; siempre incluir sección de inferencias extrapoladas más allá del texto original.
- Ver `references/integration_workflow_patterns.md` para pipeline OCR completo.
- Ver `references/conceptual_critical_framework_pattern.md` para estructura canónica y validación de marcos teóricos/críticos.
- Ver `references/manufacturing_framework_pattern.md` para checklist de integración de frameworks productivos (FABSHIP/HUMANIA).
- **Patrón de integración 4 fases (Copiosis v7.1):**
  1. **Desempaquetado** — Navegación exhaustiva web → informe quirúrgico backup (`<framework>_backup.md`)
  2. **Limpieza** — Estructura en 3 perspectivas: Usuario (dolores/necesidades) · LLM (mapeo subsistemas, decisiones diseño) · Proyecto (isomorfismo MJ, homologación, confluencia, mejoras mutuas, inferencias extrapoladas)
  3. **GitHub** — Documento integración (`<framework>_integration.md`) + actualización Brief Exhaustivo (tabla frameworks §2.3, nueva §2.X, §3.0 vaso comunicante, §5.6 subsistemas, §6.1 métricas, §14.3-14.4 financiera, §16 orquestación, §17 memética, Anexo A glosario)
  4. **Evolución** — Entregables accionables P0/P1 en `lib/`, validación checklist post-integración
- Para protocolos de red abiertos/monetarios/blueprint digital, usar el skill `protocol-ecosystem-research`. Este genera:
  - mapa de repos oficiales
  - arquitectura técnica on-chain/off-chain
  - whitepaper/manifiesto offline capturado con verificación PDF
  - reference markdown en `/references/<protocol>-ecosystem.md`
  - quickstarts de instalación y notas de licencia
  - en HSCSG, vincular como referente monetario/civilizatorio y respaldar en `hscsg-monetary-integration/references/`.
