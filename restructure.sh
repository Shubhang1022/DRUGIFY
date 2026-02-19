#!/bin/bash
# Bash Script to Restructure DRUGIFY Project
# Run this: chmod +x restructure.sh && ./restructure.sh

echo "🔄 Restructuring DRUGIFY Project..."
echo ""

# Create frontend directory
echo "📁 Creating frontend directory..."
mkdir -p frontend

# Move directories
echo "📦 Moving directories..."
[ -d "src" ] && mv src frontend/
[ -d "public" ] && mv public frontend/

# Move config files
echo "⚙️  Moving configuration files..."
for file in package.json package-lock.json vite.config.ts vitest.config.ts \
            tsconfig.json tsconfig.app.json tsconfig.node.json \
            tailwind.config.ts postcss.config.js eslint.config.js \
            components.json index.html; do
    [ -f "$file" ] && mv "$file" frontend/ && echo "  ✓ Moved $file"
done

# Move environment files
echo "🔐 Moving environment files..."
[ -f ".env" ] && mv .env frontend/
[ -f ".env.example" ] && mv .env.example frontend/

# Move deployment files
echo "🚀 Moving deployment files..."
[ -f "vercel.json" ] && mv vercel.json frontend/
[ -f ".vercelignore" ] && mv .vercelignore frontend/
[ -f "Dockerfile.frontend" ] && mv Dockerfile.frontend frontend/

# Move supabase folder if exists
[ -d "supabase" ] && echo "📊 Moving supabase folder..." && mv supabase frontend/

# Create docs folder and move documentation
echo "📚 Organizing documentation..."
mkdir -p docs
for file in *.md; do
    [ "$file" != "README.md" ] && mv "$file" docs/
done

# Update .gitignore
echo "📝 Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.local

# Backend
backend/__pycache__/
backend/*.db
backend/.env
backend/venv/

# Docs
docs/.DS_Store
EOF

# Cleanup old files
echo "🧹 Cleaning up old files..."
rm -rf node_modules dist .vite 2>/dev/null
echo "  ✓ Removed old node_modules, dist, .vite"

echo ""
echo "✅ Restructure Complete!"
echo ""
echo "📁 New Structure:"
echo "  frontend/  - All frontend files"
echo "  backend/   - All backend files"
echo "  docs/      - Documentation"
echo ""
echo "🔧 Next steps:"
echo "  cd frontend"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "🚀 Ready to deploy!"
