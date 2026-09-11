# HSCSG Module Scaffold (the 6-place rule)

Every new assimilated module touches the store in **six** places. Miss one → cascade
of TS errors. Pattern verified across Paperclip (Orquestación), CaaS, Conway
(Autómata), Solarpunk.

## Files
1. `src/core/state/<mod>.ts` — types (`export interface ... `)
2. `src/core/lib/<mod>.ts` — PURE functions (gate-checked, no React)
3. `src/core/state/store.ts` — wire state + actions + persistence
4. `src/app/screens/<Mod>.tsx` — UI (tabs, forms, lists)
5. `src/app/App.tsx` — `<Route path="<mod>" element={<Mod/>} />`
6. `src/app/layout/Aside.tsx` — nav entry (icon + label + path)

## store.ts six edits (in order)
1. **Import types**: `import type { X, Y } from '@core/state/<mod>'` and lib fns
   `import { f1, f2 } from '@core/lib/<mod>'`.
2. **Interface field**: add `mod: ModState` under the module's section header.
3. **Interface action signatures**: add `doThing: (a: T) => void` etc.
4. **Initial state (create)**: add `mod: { ...seed or empty }` in the `create(...)`
   body (NOT in resetAll).
5. **Action implementations**: add `doThing: (a) => set((st) => ({ mod: ... }))`
   inside the `create` actions block (before `resetAll`).
6. **resetAll + partialize**: add the module to both the `resetAll` initial object
   AND the `partialize` return object (so it persists to localStorage).

## Minimal lib.ts shape (defend against MJ)
```ts
import { evaluateMJGate } from '@core/lib/orchestration'
export function survivalTier(aut) { /* derive */ }
export function evaluateX(label, ctx) {
  const g = evaluateMJGate(label, ctx)
  return { pass: g.pass, law: g.law ?? undefined, reason: g.reason }
}
```

## Screen.tsx shape
- Tabs via local `useState`.
- Read via `const { mod, doThing } = useAppStore()`.
- Render `<Card>`, `<Stat>`, `<Btn>`, `<Badge>`, `<EmptyState>`, `<SectionTitle>`
  from `@components/ui`.
- Unused `lucide-react` imports and unused type imports → `TS6133` build failure.
  Prune aggressively.
- Handler params need explicit types: `(p: T) =>`, not `(p) =>`.
