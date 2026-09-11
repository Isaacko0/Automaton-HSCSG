---
name: hscsg-repo-assimilation
description: Metodología probada para asimilar repositorios externos (cualquier stack, Solidity, Laravel, Supabase, JSON-schemas) como módulos vivos de un proyecto local React/Zustand (HSCSG_v15_OS), bajo la filosofía de economía monetaria a postmonetaria (Materialismo Jerárquico, CaaS). Usar cuando el usuario pida asimilar, integrar, hacer lo mismo con, o dé URLs de GitHub para incorporarlas a HSCSG. Incluye flujo de 4 fases, comandos Windows/git-bash, verificación y patrones de extracción.
---

# HSCSG v15 OS — Asimilación de repos externos

## Qué es HSCSG_v15_OS
App web local (sin backend) tipo sistema operativo comunitario postmonetario. Fork de Cosateca OS/Cosateca.
Stack: React 18 + TypeScript + Vite 5 + React Router 6 + Zustand 4 (persist en localStorage) + Tailwind 3 + lucide-react.
Cada repo externo se integra como un módulo vivo (pantalla navegable + estado persistido), no como dependencia.

Estructura canónica:
```
src/app/screens/<Modulo>.tsx     # 1 pantalla por módulo
src/app/App.tsx                  # rutas
src/app/layout/Aside.tsx         # nav (items con icono lucide)
src/core/lib/<modulo>.ts         # lógica PURA (sin infra)
src/core/state/<modulo>.ts       # tipos + estado inicial (makeXState)
src/core/state/store.ts          # store global (importa tipos/lib, acciones, resetAll, partialize)
docs/<repo>_backup.md            # qué es el repo original
docs/<repo>_integration.md       # triple perspectiva Usuario/LLM/HSCSG
```

## Filosofía de mapeo (SIEMPRE aplicar)
El proyecto se rige por el Materialismo Jerárquico (3 leyes), usadas como filtro de isomorfismo:
- Ley I (no dañar base material/personas) → mapea contratos/prod/recursos.
- Ley II (ganarse la vida soberanizando = AUTxCDS) → mapea trabajo/contribución/crédito.
- Ley III (lucidez, nunca engañar) → mapea transparencia/append-only/verificación.
Y el CaaS (Comunidad como Servicio): acceso por contribución real, no por dinero.

Patrones de isomorfismo vistos (reutilizables):
| Repo origen | Módulo | Mapeo clave |
|---|---|---|
| trustlines-protocol/contracts (Solidity) | Trustlines Credito | deuda bilateral simétrica getDebt, debitTransfer por ruta, sin emisor central |
| sepu85/collabberry-berry-vesting (Solidity) | Vesting ZNU | totalUnlocked/releasable/release, setBeneficiary una vez, canRenounce |
| Baruch4413/tekitl (Laravel+Inertia) | Tekitl Proyectos | FSM de etapas, roles/voluntarios, coins por endoso, timeline append-only |
| overkillkulture/sovereignty-hub + tairea/sovereignty-hub-ui | Soberania 13 Pilares | 13 pilares x 7 capas x 3 fases; matriz diagnóstica; Pattern Theory=Lucidez |
| Integral Collective (9 repos, JSON-schemas) | Integral Loop | CDS→OAD→COS→ITC→FRS loop cerrado; ITC≈ZNU (decay, no-transferible) |

## Flujo de 4 fases (OBLIGATORIO, en orden)

### Fase 0 — Respaldo PRIMERO
Nunca tocar HSCSG sin backup. Desde git-bash (NO PowerShell):
```bash
cd /c/Users/Isaacko0/Documents
cp -r HSCSG_v15_OS HSCSG_v15_OS_BACKUP_$(date +%Y%m%d_%H%M%S)
rm -rf HSCSG_v15_OS_BACKUP_*/node_modules HSCSG_v15_OS_BACKUP_*/dist
```
Verificar: `du -sh HSCSG_v15_OS_BACKUP_*/ | head -1` (~2M sin node_modules).

### Fase 1 — Clonar repo fuente
```bash
cd /c/Users/Isaacko0/Documents
timeout 120 git clone --depth 1 https://github.com/<owner>/<repo>.git repo_<short>
```
- Si falla por rutas largas en Windows (.claude/skills/, : en nombres): `git restore` materializa casi todo; ignorar assets con : (no esenciales).
- Varios repos a la vez: bucle `for r in "o/r1" "o/r2"; do d="repo_$(echo $r|sed 's#/#_#')"; timeout 120 git clone --depth 1 https://github.com/$r.git "$d"; done`.
- Verificar clones: `git -C repo_xxx ls-files | wc -l` (debe ser >0). El glob ls repo_* a veces no expande en MSYS — usar `find . -maxdepth 1 -type d -name "repo_*"`.

### Fase 2 — Documentar (backup + integración)
Crear docs/<repo>_backup.md (qué es, stack, estructura, licencia) y docs/<repo>_integration.md con triple perspectiva:
1. Usuario: qué quiere lograr con eso en su nodo.
2. LLM: qué asimilar (lógica pura) y qué extirpar (infra ajena: Solidity/EVM, Laravel/MySQL, Supabase, Three.js, GitHub Issues como UI, JSON Schema validation runtime).
3. HSCSG+CaaS: isomorfismo con Leyes I/II/III y CaaS.

### Fase 3 — Módulo real (código)
Por cada repo:
1. Tipos src/core/state/<modulo>.ts: interfaces del dominio (sin dependencias externas).
2. Lógica src/core/lib/<modulo>.ts: funciones puras (make<Modulo>State() con seed del nodo Cosateca, helpers). NO importar nada de la infra original.
3. Store src/core/state/store.ts:
   - import type { XState } from '@core/state/<modulo>'
   - import { makeXState, ... } from '@core/lib/<modulo>'
   - Añadir x: XState en la interfaz AppState y en el estado inicial del create(...).
   - Añadir firmas de acciones en la interfaz y sus implementaciones (usa set((st) => ({ x: {...st.x, ...} }))).
   - En resetAll: incluir x: makeXState().
   - En partialize del persist: incluir x: st.x.
4. Pantalla src/app/screens/<Modulo>.tsx:
   - Icono de lucide-react (usar solo nombres válidos: Droplets, Utensils, Home, Zap, BriefcaseMedical, Radio, Cog, Truck, Scale, Gavel, BookOpen, Drama, ShieldHalf, RefreshCw, Vote, PencilRuler, Clock, Hammer, Activity — NO TowerBroadcast, MasksTheater, Input, Textarea, Select).
   - UI components: solo Card, Stat, Btn, Badge, EmptyState, Field, Bar existen en @components/ui. Para inputs usa <input>/<textarea>/<select> crudos con clases Tailwind. Btn NO acepta size.
   - Leer estado con `const { x, actionX } = useAppStore()`.
5. Nav + ruta:
   - src/app/layout/Aside.tsx: añadir icono al import de lucide y item { key, label, icon, color, path }.
   - src/app/App.tsx: import { Modulo } + <Route path="modulo" element={<Modulo/>} />.

### Fase 4 — Verificar ANTES de entregar
```bash
cd /c/Users/Isaacko0/Documents/HSCSG_v15_OS
npx tsc --noEmit            # 0 errores (warnings de file not found en aliases @core son FALSOS POSITIVOS del linter, ignorar)
npm run build               # build OK
pid=$(netstat -ano 2>/dev/null | grep ":4173 " | grep LISTEN | awk '{print $5}' | head -1)
[ -n "$pid" ] && taskkill /F /PID $pid
npm run preview &           # background; espera "Local: http://localhost:4173/"
for r in "" base lucidez ... modulo; do
  echo "/$r -> $(curl -s -o /dev/null -w '%{http_code}' http://localhost:4173/$r)"
done                        # TODAS deben ser 200
```

## Pitfalls (aprendidos en esta sesión)
- lucide-react 0.453: TowerBroadcast/MasksTheater NO existen → usar Radio/Drama. Input/Textarea/Select NO son componentes del proyecto → usar HTML crudo.
- Btn size="sm" rompe tsc → quitar size.
- Windows largo paths: git clone de repos con .claude/skills/ falla checkout; git restore arregla.
- tsc File not found en aliases @core/...: falso positivo del linter inline; el npx tsc --noEmit real pasa.
- persist + seed: si localStorage ya tiene guardado el estado viejo (ej. notifList:[]), el seed nuevo en código NO se ve hasta borrar la key hscsg.v15.os.v1 en DevTools → Application → Local Storage. Documentar esto al usuario.
- CRLF warnings en git commit: inofensivos en Windows.
- No duplicar: si el usuario reitera un repo ya asimilado, confirmar y no rehacer (usar clarify si hay duda).
- Sin credenciales: nunca incluir API keys/tokens; redactar como [REDACTED].

## Commitear y pushear (Fase 3 GitHub)
El repo YA está en GitHub (origin configurado). Después de verificar:
```bash
git add .
git commit -q -m "feat: <Modulo> (<repo>) + docs"
git push origin master
```
Mensaje: referenciar repo origen, módulo, verificación (tsc/build/rutas).

## Documentación agregada (README/CHANGELOG)
Mantener README.md (índice de módulos, repos asimilados, arquitectura, cómo correr) y CHANGELOG.md (v15.0→vN por asimilación). El usuario lo pide explícitamente al cerrar una tanda.

## Extender HSCSG con features (no solo asimilación)
Para añadir funcionalidad interna (toggles de tema, banners, reveal de datos): ver `references/hscsg-architecture.md`. Patrón clave: data-attribute en documentElement + bloque CSS `[data-x="on"]` que redefine variables + reveal de `.raw-hidden`; acción en store que setea/deleta el dataset y se incluye en `partialize`. Ejemplo real: Modo Lucidez (botón luna→sol que activa tema diurno + `.lucidez-raw` con datos crudos/provenance + `.lucidez-banner` de Ley III).

## Cómo responder al usuario
- Idioma: español, respuestas concisas (sin explicación excesiva).
- Reportar siempre: backup creado (ruta+size), rutas verificadas (200), tsc/build OK, isomorfismo con Leyes.
- Ofrecer siguiente paso (otro repo / documentar / commitear).
- Creatividad: el usuario valora ir más allá de lo literal y sumar valor coherente con la filosofía del proyecto (no solo lo mínimo). Al pedir funcionalizar algo, agradece iniciativa extra (ej. Modo Lucidez: pidió el botón de luna y se entregó tema diurno + reveal de datos crudos + banner de Ley III).
