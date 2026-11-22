#!/bin/bash
# Cosatecon Dashboard Launcher (Git Bash / WSL)
# Uso: ./start-all.sh

set -e

INSTABOX_EXE="/c/Users/Isaacko0/AppData/Local/Programs/instabox/instabox.exe"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "  Cosatecon - Iniciando todo..."
echo "========================================"
echo

echo "[1/3] Despertando Instabox..."
"$INSTABOX_EXE" wake box-40416d 2>/dev/null || echo "[WARN] Instabox ya despierto o error (continua)"

echo
echo "[2/3] Iniciando Dashboard Server..."
cd "$SCRIPT_DIR"
node server.js &
DASHBOARD_PID=$!
echo "Dashboard PID: $DASHBOARD_PID"

echo
echo "[3/3] Esperando a que el servidor responda..."
sleep 3

echo
echo "Abriendo dashboard en navegador..."
cmd.exe /c start "" "http://localhost:3456" 2>/dev/null || xdg-open "http://localhost:3456" 2>/dev/null || echo "Abre manualmente: http://localhost:3456"

echo
echo "========================================"
echo "  LISTO - Dashboard en http://localhost:3456"
echo "========================================"
echo
echo "Botones:"
echo "  [+] Iniciar Agente  - levanta Cosatecon en Instabox"
echo "  [-] Detener         - mata el proceso"
echo "  [R] Reiniciar       - stop + start"
echo
echo "Logs en tiempo real via WebSocket (auto-conecta)"
echo
echo "Presiona Ctrl+C para detener el dashboard"
echo

# Trap para limpiar al salir
trap "echo 'Deteniendo dashboard...'; kill $DASHBOARD_PID 2>/dev/null; exit" INT TERM

# Mantener script vivo
wait $DASHBOARD_PID