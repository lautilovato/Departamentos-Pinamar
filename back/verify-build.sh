#!/bin/bash
# Script para verificar el build
echo "🔍 Verificando el build..."

if [ ! -f "dist/main.js" ]; then
    echo "❌ ERROR: dist/main.js no existe"
    echo "📁 Contenido del directorio dist:"
    ls -la dist/ || echo "dist/ no existe"
    exit 1
fi

echo "✅ dist/main.js existe"
echo "📁 Contenido del directorio dist:"
ls -la dist/

echo "🚀 Iniciando aplicación..."
node dist/main.js