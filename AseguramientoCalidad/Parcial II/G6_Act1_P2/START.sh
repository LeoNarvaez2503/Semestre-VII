#!/bin/bash

# Script de instalación y ejecución rápida para macOS/Linux
# Standards Viewer - React App

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Standards Viewer - Aplicación React Ultra-Moderna             ║"
echo "║  ISO/IEC 29110 Documentation                                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "Descárgalo de: https://nodejs.org"
    exit 1
fi

echo "✓ Node.js detectado"
echo ""
echo "Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error en la instalación"
    exit 1
fi

echo "✓ Dependencias instaladas correctamente"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  Iniciando servidor de desarrollo...                           ║"
echo "║  La aplicación se abrirá en: http://localhost:5173             ║"
echo "║                                                                ║"
echo "║  Presiona Ctrl+C en la terminal para detener el servidor       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

npm run dev
