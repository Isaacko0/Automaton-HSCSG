# Contexto para continuar en nuevo chat - Automaton-HSCSG

## Estado actual (2026-11-26)

### ✅ FUNCIONANDO
1. **Config centralizada** en `/data/home/.automaton/automaton.json`:
   - `openaiApiKey`, `openaiCompatBaseUrl`, `openaiBaseUrl` (NVIDIA)
   - `inferenceModel: "nvidia/nemotron-3-ultra-550b-a55b"`
2. **Build pasa** en host e Instabox (branch `modo-local`)
3. **Modelos NVIDIA habilitados** en registry con `parameterStyle: max_tokens`
4. **Cliente inference directo FUNCIONA** (test manual 200 OK):
   ```javascript
   createInferenceClient({ openaiCompatBaseUrl, openaiApiKey, getModelProvider })
     .chat([{role: "user", content: "test"}])  // → SUCCESS
   ```

### ❌ BLOQUEADOR: InferenceRouter falla 404
- El agente usa `InferenceRouter.route()` → llama a `inference.chat` del **cliente viejo** (`createInferenceClient` en `src/conway/inference.ts`)
- Ese cliente **NO usa `openaiCompatBaseUrl` del config** → usa `process.env.OPENAI_COMPAT_BASE_URL` que **no llega al proceso background** (SSH `nohup ... &` no hereda env vars)

### Próximo paso técnico
En `src/agent/loop.ts` línea 538, el router recibe `inference.chat` como callback:
```typescript
const routerResult = await inferenceRouter.route(request,
  (msgs, opts) => inference.chat(msgs, { ...opts, tools: inferenceTools })
);
```

**Opción A (rápida):** Pasar `unifiedInference` (usa `ProviderRegistry` y funciona) en lugar de `inference`
**Opción B (correcta):** Arreglar `createInferenceClient` para usar `config.openaiCompatBaseUrl`/`config.openaiApiKey` que ya se setean en `process.env` al inicio en `src/index.ts`

### Raíz del problema
El SSH `nohup ... &` en `dashboard/server.js` no hereda `process.env` seteado por el parent. Solución definitiva: **systemd user service** o `screen -dmS` para auto-inicio real (no dashboard).

---

## Archivos clave modificados
- `src/index.ts` - Setea `process.env` desde config, pasa computed properties `['openaiApiKey']: config.openaiApiKey` (fix TS bug)
- `src/conway/inference.ts` - Cliente viejo que usa `process.env` (problemático en background)
- `src/inference/router.ts` - `InferenceRouter` que selecciona modelo y llama a `inferenceChat`
- `src/agent/loop.ts` - Línea 538: pasa `inference.chat` al router
- `dashboard/server.js` - `START_SCRIPT_B64` con env vars inline (funciona pero no hereda process.env)
- `/data/home/.automaton/automaton.json` - Config centralizada

---

## Comandos útiles en Instabox
```bash
# Ver logs
tail -50 ~/automaton.log

# Test inference directo
cd /data/home/Automaton-HSCSG && AUTOMATON_LOCAL_MODE=1 node -e '
const { loadConfig } = require("./dist/config.js");
const { createInferenceClient } = require("./dist/conway/inference.js");
const { ModelRegistry } = require("./dist/inference/registry.js");
const db = require("./dist/state/database.js");
const path = require("path");
const config = loadConfig();
const database = db.createDatabase(path.join(process.env.HOME, ".automaton/state.db"));
const modelRegistry = new ModelRegistry(database.raw); modelRegistry.initialize();
const inference = createInferenceClient({
  apiUrl: config.conwayApiUrl, apiKey: "local-mode",
  defaultModel: config.inferenceModel, maxTokens: config.maxTokensPerTurn,
  openaiApiKey: config.openaiApiKey, openaiCompatBaseUrl: config.openaiCompatBaseUrl,
  openaiBaseUrl: config.openaiBaseUrl, anthropicApiKey: config.anthropicApiKey,
  ollamaBaseUrl: config.ollamaBaseUrl,
  getModelProvider: (modelId) => modelRegistry.get(modelId)?.provider,
});
inference.chat([{role: "user", content: "test"}], {maxTokens: 10})
  .then(r => console.log("SUCCESS:", r.message.content))
  .catch(e => console.log("ERROR:", e.message));
'

# Rebuild en Instabox
cd /data/home/Automaton-HSCSG && rm -rf dist && pnpm build
```

---

## Repositorio
- GitHub: https://github.com/Isaacko0/Automaton-HSCSG
- Branch: `modo-local`
- Commits recientes: `c318686` (computed properties fix), `f1ae7f8` (config pass), `3db627e` (inline env vars)

---

## Nota importante
El vault Obsidian del usuario está en `H:\Mi unidad\HSCSG Empresa mas memoria\` (fuente filosófica HSCSG). Documentos sensibles (CHANGELOG, etc.) SOLO local, NO subir a GitHub.