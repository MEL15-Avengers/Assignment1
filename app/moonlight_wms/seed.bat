@echo off
title Moonlight WMS — Database Seeder
echo.
echo  =====================================================
echo   Moonlight WMS — Database Seeder
echo   Inserts 10,000 grocery products + 4 user accounts
echo  =====================================================
echo.

:: Check Node.js is available
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js is not installed or not in PATH.
    echo  Download from https://nodejs.org/
    pause
    exit /b 1
)

:: Check pg package is available
if not exist "node_modules\pg" (
    echo  Installing pg package...
    npm install pg
    echo.
)

:: Run the seed script
node seed.mjs
if %errorlevel% neq 0 (
    echo.
    echo  Seed script failed. Check the error above.
    pause
    exit /b 1
)

echo.
pause
