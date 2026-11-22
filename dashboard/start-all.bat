@echo off
chcp 65001 >nul
title Cosatecaton Dashboard Launcher

echo ========================================
echo  Cosatecaton - Iniciando todo...
echo ========================================
echo.

echo [1/3] Despertando Instabox...
"C:\Users\Isaacko0\AppData\Local\Programs\instabox\instabox.exe" wake box-40416d
if errorlevel 1 (
    echo [WARN] Instabox ya despierto o error (continua)
)

echo.
echo [2/3] Iniciando Dashboard Server...
cd /d "%~dp0"
start "Cosatecon Dashboard" cmd /k "node server.js"

echo.
echo [3/3] Esperando a que el servidor responda...
ping -n 4 127.0.0.1 >nul

echo.
echo Abriendo dashboard en navegador...
start "" "http://localhost:3456"

echo.
echo ========================================
echo  LISTO - Dashboard en http://localhost:3456
echo ========================================
echo.
echo Botones:
echo   [+] Iniciar Agente  - levanta Cosatecaton en Instabox
echo   [-] Detener         - mata el proceso
echo   [R] Reiniciar       - stop + start
echo.
echo Logs en tiempo real via WebSocket (auto-conecta)
echo.
pause