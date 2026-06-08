@echo off
REM Script de instalación y ejecución rápida
REM Standards Viewer - React App

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Standards Viewer - Aplicación React Ultra-Moderna             ║
echo ║  ISO/IEC 29110 Documentation                                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo Descárgalo de: https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js detectado

echo.
echo Instalando dependencias...
call npm install

if errorlevel 1 (
    echo ❌ Error en la instalación
    pause
    exit /b 1
)

echo ✓ Dependencias instaladas correctamente

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  Iniciando servidor de desarrollo...                           ║
echo ║  La aplicación se abrirá en: http://localhost:5173             ║
echo ║                                                                ║
echo ║  Presiona Ctrl+C en la terminal para detener el servidor       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

call npm run dev

pause
