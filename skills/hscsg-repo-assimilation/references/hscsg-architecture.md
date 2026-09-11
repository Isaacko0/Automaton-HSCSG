# HSCSG_v15_OS — Arquitectura interna y patrones de extensión

Útil para añadir features al proyecto (no solo asimilar repos). Stack: React18+TS+Vite5+RR6+Zustand4(persist)+Tailwind3+lucide-react.

## Theming por data-attribute (patrón Modo Lucidez)
- Variables CSS en `src/shared/styles/global.css` bajo `:root`: `--ink, --mut, --dim, --line, --lineq, --surf, --surf2, --surf3, --color-vacio, --color-chispa`.
- Toggle: en el store añade `x: boolean` + `toggleX` que hace `document.documentElement.dataset.x = 'on'` (o `delete`) y lo incluye en `partialize`.
- En CSS: `[data-x="on"] { --surf:#f7faff; --ink:#0a1024; ... }` redefine vars → tema claro. También `[data-x="on"] body { background:var(--color-vacio); color:var(--ink) }`.
- Reveal progresivo: `.raw-hidden { display:none } [data-x="on"] .raw-hidden { display:block }` para mostrar "datos crudos" solo en modo luz.
- Botón en `src/app/layout/Header.tsx`; banner global en `src/app/layout/Layout.tsx` con clase `.x-banner { display:none } [data-x="on"] .x-banner { display:flex }`.

## Store (zustand persist)
- Acciones que tocan DOM deben guardar `typeof document !== 'undefined'` antes de `document.documentElement.dataset`.
- Siempre incluir el nuevo campo en `partialize` para que persista en localStorage (key `hscsg.v15.os.v1`).
- Pitfall: si localStorage ya tiene estado viejo, el default nuevo no se ve hasta borrar la key en DevTools → Application → Local Storage.

## Ejemplo: Modo Lucidez (Ley III: lucidez, nunca engañar)
Botón luna→sol en Header. Activa tema diurno + `.lucidez-raw` (fórmula real de System Health, desglose del loop, provenance de señales FRS) + `.lucidez-banner`. Iconos válidos: Moon, Sun, Eye.
