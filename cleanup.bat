@echo off
echo ========================================
echo Cleaning up old node_modules
echo ========================================
echo.

echo Stopping Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM esbuild.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Removing old folders...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q "node_modules"
    echo Done!
) else (
    echo node_modules not found
)

if exist "dist" (
    echo Removing dist...
    rmdir /s /q "dist"
    echo Done!
) else (
    echo dist not found
)

if exist ".vite" (
    echo Removing .vite...
    rmdir /s /q ".vite"
    echo Done!
) else (
    echo .vite not found
)

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo Next steps:
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
pause
