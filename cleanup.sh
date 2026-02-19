#!/bin/bash
echo "========================================"
echo "Cleaning up old node_modules"
echo "========================================"
echo ""

echo "Stopping Node processes..."
pkill -f node 2>/dev/null
pkill -f esbuild 2>/dev/null
sleep 2

echo ""
echo "Removing old folders..."

if [ -d "node_modules" ]; then
    echo "Removing node_modules..."
    rm -rf node_modules
    echo "  ✓ Done!"
else
    echo "  node_modules not found"
fi

if [ -d "dist" ]; then
    echo "Removing dist..."
    rm -rf dist
    echo "  ✓ Done!"
else
    echo "  dist not found"
fi

if [ -d ".vite" ]; then
    echo "Removing .vite..."
    rm -rf .vite
    echo "  ✓ Done!"
else
    echo "  .vite not found"
fi

echo ""
echo "========================================"
echo "Cleanup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  cd frontend"
echo "  npm install"
echo "  npm run dev"
echo ""
