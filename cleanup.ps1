# PowerShell Cleanup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleaning up old node_modules" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stop Node processes
Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*esbuild*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Removing old folders..." -ForegroundColor Yellow

# Remove node_modules
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction Stop
    Write-Host "  ✓ Done!" -ForegroundColor Green
} else {
    Write-Host "  node_modules not found" -ForegroundColor Gray
}

# Remove dist
if (Test-Path "dist") {
    Write-Host "Removing dist..." -ForegroundColor Yellow
    Remove-Item -Path "dist" -Recurse -Force -ErrorAction Stop
    Write-Host "  ✓ Done!" -ForegroundColor Green
} else {
    Write-Host "  dist not found" -ForegroundColor Gray
}

# Remove .vite
if (Test-Path ".vite") {
    Write-Host "Removing .vite..." -ForegroundColor Yellow
    Remove-Item -Path ".vite" -Recurse -Force -ErrorAction Stop
    Write-Host "  ✓ Done!" -ForegroundColor Green
} else {
    Write-Host "  .vite not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  cd frontend" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
