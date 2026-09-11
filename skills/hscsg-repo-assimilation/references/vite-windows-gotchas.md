# Vite on Windows (MSYS/Git Bash) — gotchas + fixes

## Blank page opening dist/index.html directly
**Cause**: dev `build` emits ABSOLUTE asset paths (`/assets/index-xxx.js`) and uses
`<script type="module">`. Opening with `file://` makes the browser look for
`C:\assets\...` (404) and ES modules are blocked by CORS on `file://`. Result: blank.
**Fix**: serve it. `npm run preview` or `npm run dev`, then open the http URL.
Do NOT tell the user to double-click the html.

## Make the dist portable (open vs serve)
Add `vite.config.ts` with `base: './'` so assets become `./assets/...` (relative).
Still, `file://` + ES modules often fails; serving is the guaranteed path.
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: { alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
    '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
    '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
    '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
    '@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
  }},
  server: { port: 3000 }, preview: { port: 4173 },
  build: { outDir: 'dist' },
})
```
Without `resolve.alias`, Vite cannot resolve `@core/...` even though `tsc` can
(TS `paths` ≠ Vite resolver). Build fails with "Failed to resolve import @core/...".

## Zombie ports on Windows
After killing a dev/preview, the port may still report "in use" (TIME_WAIT). Each
new start increments: 3000→3001→3002→... and 4173→4174→.... Find+kill:
```bash
for p in 3000 3001 3002 3003 4173 4174 4175 4176; do
  pid=$(netstat -ano 2>/dev/null | grep ":$p " | grep LISTEN | awk '{print $5}' | head -1)
  [ -n "$pid" ] && kill -9 $pid
done
```
Then relaunch; it should bind 3000/4173. If it still climbs, the OS is holding
TIME_WAIT — just use whichever port it reports; functionality is identical.

## Verify after build
```bash
npm run build && npx tsc --noEmit   # both exit 0
for r in "" base lucidez colectivo automat caas solarpunk; do
  curl -s -o /dev/null -w "/$r -> %{http_code}\n" http://localhost:4173/$r
done   # all 200
```
