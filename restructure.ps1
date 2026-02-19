# PowerShell Script to Restructure DRUGIFY Project
# Run this in PowerShell: .\restructure.ps1

Write-Host "🔄 Restructuring DRUGIFY Project..." -ForegroundColor Cyan
Write-Host ""

# Create frontend directory
Write-Host "📁 Creating frontend directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "frontend" | Out-Null

# Move directories
Write-Host "📦 Moving directories..." -ForegroundColor Yellow
if (Test-Path "src") { Move-Item -Path "src" -Destination "frontend/" -Force }
if (Test-Path "public") { Move-Item -Path "public" -Destination "frontend/" -Force }

# Move config files
Write-Host "⚙️  Moving configuration files..." -ForegroundColor Yellow
$configFiles = @(
    "package.json",
    "package-lock.json",
    "vite.config.ts",
    "vitest.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "eslint.config.js",
    "components.json",
    "index.html"
)

foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Move-Item -Path $file -Destination "frontend/" -Force
        Write-Host "  ✓ Moved $file" -ForegroundColor Green
    }
}

# Move environment files
Write-Host "🔐 Moving environment files..." -ForegroundColor Yellow
if (Test-Path ".env") { Move-Item -Path ".env" -Destination "frontend/" -Force }
if (Test-Path ".env.example") { Move-Item -Path ".env.example" -Destination "frontend/" -Force }

# Move deployment files
Write-Host "🚀 Moving deployment files..." -ForegroundColor Yellow
if (Test-Path "vercel.json") { Move-Item -Path "vercel.json" -Destination "frontend/" -Force }
if (Test-Path ".vercelignore") { Move-Item -Path ".vercelignore" -Destination "frontend/" -Force }
if (Test-Path "Dockerfile.frontend") { Move-Item -Path "Dockerfile.frontend" -Destination "frontend/" -Force }

# Move supabase folder if exists
if (Test-Path "supabase") {
    Write-Host "📊 Moving supabase folder..." -ForegroundColor Yellow
    Move-Item -Path "supabase" -Destination "frontend/" -Force
}

# Create docs folder and move documentation
Write-Host "📚 Organizing documentation..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "docs" | Out-Null

$docFiles = Get-ChildItem -Path "." -Filter "*.md" | Where-Object { $_.Name -ne "README.md" }
foreach ($doc in $docFiles) {
    Move-Item -Path $doc.FullName -Destination "docs/" -Force
}

# Update .gitignore
Write-Host "📝 Updating .gitignore..." -ForegroundColor Yellow
$gitignoreContent = @"

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
"@

Add-Content -Path ".gitignore" -Value $gitignoreContent

Write-Host ""
Write-Host "✅ Restructure Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 New Structure:" -ForegroundColor Cyan
Write-Host "  frontend/  - All frontend files" -ForegroundColor White
Write-Host "  backend/   - All backend files" -ForegroundColor White
Write-Host "  docs/      - Documentation" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Test your setup:" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
