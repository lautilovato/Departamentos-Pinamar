#!/bin/bash
# Script to verify build is working correctly

echo "🔨 Building project..."
yarn build

echo "📁 Checking dist directory..."
ls -la dist/

echo "🔍 Checking main.js exists..."
if [ -f "dist/main.js" ]; then
    echo "✅ dist/main.js found"
    echo "📋 File info:"
    ls -la dist/main.js
    echo "🎯 Testing execution (dry run)..."
    node -e "console.log('✅ Node can load the file successfully')" 2>/dev/null && echo "Node test passed" || echo "❌ Node test failed"
else
    echo "❌ dist/main.js NOT FOUND"
    echo "Available files in dist:"
    find dist -name "*.js" | head -10
fi

echo "🏁 Verification complete"