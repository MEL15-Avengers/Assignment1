@echo off
setlocal EnableDelayedExpansion
title Moonlight WMS
cls

echo.
echo  +=========================================================+
echo  ^|        MOONLIGHT WMS  --  Setup ^& Launcher             ^|
echo  ^|        Warehouse Management System for Grocery         ^|
echo  +=========================================================+
echo.

set "DIR=%~dp0"
set "DIR=%DIR:~0,-1%"
set "ENVFILE=%DIR%\.env"
set "SEEDED=%DIR%\.seeded"
set "DB=moonlight_wms"
set "NODE_VER=20.19.1"
set "STEP=0"

:: ============================================================
:: STEP 1: Node.js
:: ============================================================
call :hdr "Checking Node.js"
node --version >nul 2>&1
if not errorlevel 1 (
    for /f "tokens=*" %%v in ('node --version') do echo     Node.js %%v is ready.
    goto :node_ok
)
echo     Not found. Installing Node.js...
winget --version >nul 2>&1
if not errorlevel 1 (
    winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements >nul 2>&1
) else (
    set "ARCH=x64"
    if "%PROCESSOR_ARCHITECTURE%"=="ARM64" set "ARCH=arm64"
    set "MSI=%TEMP%\node.msi"
    echo     Downloading Node.js v%NODE_VER%...
    powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v%NODE_VER%/node-v%NODE_VER%-%ARCH%.msi' -OutFile '!MSI!' -UseBasicParsing" >nul 2>&1
    msiexec /i "!MSI!" /quiet /passive ADDLOCAL=ALL
    del "!MSI!" >nul 2>&1
)
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "[System.Environment]::GetEnvironmentVariable(\"PATH\",\"Machine\") + \";\" + [System.Environment]::GetEnvironmentVariable(\"PATH\",\"User\")"') do set "PATH=%%i"
node --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js install failed. Install from https://nodejs.org/ then re-run.
    pause & exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo     Node.js %%v installed.
:node_ok

:: ============================================================
:: STEP 2: PostgreSQL (psql)
:: ============================================================
call :hdr "Checking PostgreSQL"
psql --version >nul 2>&1
if not errorlevel 1 goto :pg_ok
:: Scan for any installed version dynamically
for /f "usebackq delims=" %%p in (`powershell -NoProfile -Command "Get-ChildItem 'C:\Program Files\PostgreSQL' -Filter psql.exe -Recurse -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty DirectoryName" 2^>nul`) do (
    if not "%%p"=="" ( set "PATH=%%p;!PATH!" & goto :pg_ok )
)
echo     Not found. Installing via winget...
winget install -e --id PostgreSQL.PostgreSQL --silent --accept-package-agreements --accept-source-agreements
for /f "tokens=*" %%i in ('powershell -NoProfile -Command "[System.Environment]::GetEnvironmentVariable(\"PATH\",\"Machine\") + \";\" + [System.Environment]::GetEnvironmentVariable(\"PATH\",\"User\")"') do set "PATH=%%i"
for /f "usebackq delims=" %%p in (`powershell -NoProfile -Command "Get-ChildItem 'C:\Program Files\PostgreSQL' -Filter psql.exe -Recurse -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1 -ExpandProperty DirectoryName" 2^>nul`) do (
    if not "%%p"=="" set "PATH=%%p;!PATH!"
)
psql --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: psql not found. Install from https://www.postgresql.org/download/windows/
    pause & exit /b 1
)
:pg_ok
for /f "tokens=*" %%v in ('psql --version') do echo     %%v is ready.

:: ============================================================
:: STEP 3: Environment (.env)  -- skip if already configured
:: ============================================================
call :hdr "Environment (.env)"
set "DB_PASS="
set "GROQ_KEY="
if exist "%ENVFILE%" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%ENVFILE%") do (
        if "%%a"=="GROQ_API_KEY" set "GROQ_KEY=%%b"
        if "%%a"=="_DBPASS"      set "DB_PASS=%%b"
    )
)
if not "!DB_PASS!"=="" if not "!GROQ_KEY!"=="your_groq_api_key_here" if not "!GROQ_KEY!"=="" (
    echo     Already configured. Skipping.
    set "PGPASSWORD=!DB_PASS!"
    goto :env_ok
)
:: Ask only what is missing
if "!DB_PASS!"=="" (
    echo.
    set /p "DB_PASS=    Enter PostgreSQL 'postgres' password: "
    if "!DB_PASS!"=="" set "DB_PASS=postgres"
)
if "!GROQ_KEY!"=="" (
    echo.
    echo     Groq AI key is free at https://console.groq.com/
    set /p "GROQ_KEY=    Enter Groq API key (or Enter to skip): "
    if "!GROQ_KEY!"=="" set "GROQ_KEY=your_groq_api_key_here"
)
if "!GROQ_KEY!"=="your_groq_api_key_here" (
    echo.
    echo     Groq key not set yet. Enter it now or press Enter to skip:
    set /p "GROQ_KEY=    Groq API key: "
    if "!GROQ_KEY!"=="" set "GROQ_KEY=your_groq_api_key_here"
)
(
    echo DATABASE_URL=postgresql://postgres:!DB_PASS!@localhost:5432/%DB%
    echo API_PORT=5000
    echo CLIENT_ORIGIN=http://localhost:5173
    echo APP_URL=http://localhost:5173
    echo VITE_API_URL=http://localhost:5000/api
    echo GROQ_API_KEY=!GROQ_KEY!
    echo _DBPASS=!DB_PASS!
) > "%ENVFILE%"
echo     .env saved.
set "PGPASSWORD=!DB_PASS!"
:env_ok

:: ============================================================
:: STEP 4: npm packages  -- skip if node_modules exists
:: ============================================================
call :hdr "npm packages"
cd /d "%DIR%"
if exist "node_modules" (
    echo     Already installed. Skipping.
    goto :npm_ok
)
echo     Installing packages (first run takes 1-2 min)...
npm install --no-audit --loglevel=warn
echo     Done.
:npm_ok

:: ============================================================
:: STEP 5: PostgreSQL service  -- skip if already running
:: ============================================================
call :hdr "PostgreSQL service"
set "PG_SVC="
for /f "usebackq delims=" %%s in (`powershell -NoProfile -Command "(Get-Service -Name '*postgres*' -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like '*PostgreSQL*' } | Sort-Object DisplayName -Descending | Select-Object -First 1).Name" 2^>nul`) do set "PG_SVC=%%s"
if "!PG_SVC!"=="" (
    echo     No service detected. Assuming PostgreSQL is running.
    goto :pg_svc_ok
)
set "PG_STATUS="
for /f "usebackq delims=" %%t in (`powershell -NoProfile -Command "(Get-Service -Name '!PG_SVC!').Status" 2^>nul`) do set "PG_STATUS=%%t"
if /i "!PG_STATUS!"=="Running" (
    echo     !PG_SVC! is already running.
    goto :pg_svc_ok
)
echo     Starting !PG_SVC!...
powershell -NoProfile -Command "Start-Service -Name '!PG_SVC!' -ErrorAction Stop" >nul 2>&1
if not errorlevel 1 (
    echo     Started.
    goto :pg_svc_ok
)
powershell -NoProfile -Command "Start-Process powershell -ArgumentList '-NoProfile -Command Start-Service -Name ''!PG_SVC!''' -Verb RunAs -Wait" >nul 2>&1
echo     Started (elevated).
:pg_svc_ok

:: ============================================================
:: STEP 6: Database  -- skip if already exists
:: ============================================================
call :hdr "Database"
:: Test connection first using temp file to avoid pipe issues
psql -U postgres -h localhost -p 5432 -c "\q" >nul 2>&1
if errorlevel 1 (
    echo.
    echo  WARNING: Cannot connect to PostgreSQL.
    echo  Check password in .env or re-run script to re-enter it.
    echo  Tip: delete .env to be prompted again.
    echo.
    pause
    goto :db_ok
)
:: Write DB list to temp file to avoid pipe parsing issues
set "TMP=%TEMP%\wms_dbcheck.txt"
psql -U postgres -h localhost -p 5432 -tc "SELECT datname FROM pg_database WHERE datname='%DB%';" > "%TMP%" 2>nul
findstr /i "%DB%" "%TMP%" >nul 2>&1
if not errorlevel 1 (
    echo     Database '%DB%' already exists. Skipping.
    del "%TMP%" >nul 2>&1
    goto :db_ok
)
del "%TMP%" >nul 2>&1
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE %DB%;" >nul 2>&1
echo     Database '%DB%' created.
:db_ok

:: ============================================================
:: STEP 7: Seed data
:: ============================================================
call :hdr "Seed data"

if exist "%SEEDED%" (
    echo     Data already seeded.
    echo.
    echo     [1] Keep existing data and launch  (default)
    echo     [2] Re-seed  (adds more records)
    echo.
    set /p "SCHOICE=    Choose [1 or 2]: "
    if "!SCHOICE!"=="2" goto :do_seed
    echo     Keeping existing data.
    goto :seed_ok
)

echo     No seed data found.
echo.
echo     [1] Fresh install  - seed 10,000 products + 4 user accounts  (default)
echo     [2] Start empty    - no sample data
echo.
set /p "SCHOICE=    Choose [1 or 2]: "
if "!SCHOICE!"=="2" (
    echo     Starting empty. Run seed.bat any time to add data.
    goto :seed_ok
)
:do_seed
echo.
echo     Seeding database... (~20 seconds)
cd /d "%DIR%"
set "DATABASE_URL=postgresql://postgres:!DB_PASS!@localhost:5432/%DB%"
node seed.mjs
:seed_ok

:: ============================================================
:: Launch
:: ============================================================
echo.
echo  +=========================================================+
echo  ^|  All set! Starting Moonlight WMS...                    ^|
echo  ^|  Open http://localhost:5173 in your browser            ^|
echo  +=========================================================+
echo.
cd /d "%DIR%"
npm run dev:full
goto :eof


:: ============================================================
:: SUBROUTINE: print step header
:: ============================================================
:hdr
set /a STEP+=1
echo.
echo  [%STEP%] %~1...
exit /b 0
