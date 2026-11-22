# Cosatecon Dashboard

Interfaz web para monitorear y controlar el agente **Cosatecon** (Conway Automaton en modo local) corriendo en Instabox.

## 🚀 Inicio Rápido

### Prerrequisitos
- **Windows** con Git Bash o PowerShell
- **Instabox CLI** instalado (`instabox.exe`)
- **Node.js** 18+
- Acceso a la box `box-40416d` en Instabox

### Opción 1: Script automático (recomendado)
```bash
# Git Bash / PowerShell
./start-all.bat     # Windows cmd/PowerShell
./start-all.sh      # Git Bash / WSL
```
Esto:
1. Despierta Instabox (`instabox.exe wake box-40416d`)
2. Inicia el servidor dashboard (`node server.js` en puerto 3456)
3. Abre `http://localhost:3456` en el navegador

### Opción 2: Manual
```bash
# Terminal 1: Despertar Instabox
instabox.exe wake box-40416d

# Terminal 2: Iniciar dashboard
cd dashboard
npm install
node server.js

# Navegador: http://localhost:3456
```

---

## 🎛️ Interfaz

### Pestaña: **Estado**
- **Badge**: 🟢 Ejecutándose / 🔴 Detenido + PID
- **Métricas**: PID, Uptime, Turns, Créditos
- **Botones de control**:
  - `[+] Iniciar Agente` — Levanta Cosatecon en Instabox
  - `[-] Detener` — Mata el proceso
  - `[R] Reiniciar` — Stop + Start
- **Logs en tiempo real** (WebSocket auto-conectado)
  - Checkbox `Seguir` — Auto-scroll
  - Checkbox `Auto-scroll` — Scroll automático
  - Botón `Limpiar` — Vaciar buffer
  - Botón `Actualizar` — Refrescar estado/config/skills

### Pestaña: **Configuración**
- Editor JSON del archivo `/data/home/.automaton/automaton.json`
- Botón `Guardar Config` — Persiste cambios en Instabox (base64)
- Parámetros clave mostrados abajo (modelo, tokens, treasury, hijos)

### Pestaña: **Skills**
- Lista skills disponibles en `/data/home/Automaton-HSCSG/skills/` y `/data/home/.automaton/skills/`

---

## ⚙️ Variables de Entorno (Modo Local)

El agente en Instabox corre con:
```bash
AUTOMATON_LOCAL_MODE=1
OPENAI_COMPAT_BASE_URL=https://integrate.api.nvidia.com
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
OPENAI_API_KEY=<tu-nvidia-api-key>
```

Configurado en `/data/home/.automaton/automaton.json`:
```json
{
  "inferenceModel": "nvidia/nemotron-3-ultra-550b-a55b",
  "openaiApiKey": "***",
  ...
}
```

---

## 🔧 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/status` | Estado del agente (running, pid, logs, config) |
| POST | `/api/agent/start` | Iniciar agente |
| POST | `/api/agent/stop` | Detener agente |
| POST | `/api/agent/restart` | Reiniciar agente |
| GET | `/api/config` | Obtener config JSON |
| POST | `/api/config` | Actualizar config (base64) |
| POST | `/api/instruction` | Enviar instrucción al agente |

### WebSocket
Conectar a `ws://localhost:3456`:
```json
// Acciones
{ "action": "getStatus" }
{ "action": "startTail" }
{ "action": "stopTail" }
{ "action": "startAgent" }
{ "action": "stopAgent" }
{ "action": "restartAgent" }
{ "action": "getConfig" }
{ "action": "updateConfig", "config": {...} }
{ "action": "getSkills" }
{ "action": "sendInstruction", "instruction": "..." }
```

---

## 📁 Estructura

```
dashboard/
├── package.json       # Dependencias: express, ws, cors
├── server.js          # Express + WebSocket + SSH via instabox.exe
├── public/
│   ├── index.html     # UI completa (tabs, logs, config, skills)
│   └── favicon.ico
├── start-all.bat      # Launcher Windows
├── start-all.sh       # Launcher Git Bash/WSL
└── README.md          # Este archivo
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| `instabox.exe` no encontrado | Verificar ruta en `server.js` línea 49 |
| Agente no inicia (crash DB) | En Instabox: `rm -f /data/home/.automaton/state.db*` |
| Dashboard no conecta a Instabox | `instabox.exe wake box-40416d` y verificar SSH |
| Botones no reaccionan | Hard refresh `Ctrl+F5`, revisar consola (F12) |
| Puerto 3456 ocupado | Cambiar `PORT` en `server.js` |

---

## 🔐 Seguridad

- **Sin credenciales en código** — API keys via env vars / config JSON en Instabox
- **Ejecución local** — Dashboard corre en tu máquina, solo SSH a Instabox
- **Base64 para config** — Evita problemas de escaping en SSH

---

## 📝 Notas

- El agente **Cosatecon** usa modelo `nvidia/nemotron-3-ultra-550b-a55b` vía NVIDIA OpenAI-compatible endpoint
- Créditos locales: 1000¢ ($10) fijos (`AUTOMATON_LOCAL_CREDITS_CENTS`)
- Wallet: `0xFa34D9BFF7aF9C2EC276a2ABbe8CdFa42377DB68` (sin fondos, solo local)
- Instabox se pausa a los ~30 min de inactividad → `instabox.exe wake box-40416d` para reactivar

---

**Desarrollado como parte del proyecto HSCSG / Conway Automaton**