@echo off
title CAFM System Launcher
color 0A

echo.
echo  ██████╗ █████╗ ███████╗███╗   ███╗    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
echo ██╔════╝██╔══██╗██╔════╝████╗ ████║    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
echo ██║     ███████║█████╗  ██╔████╔██║    ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
echo ██║     ██╔══██║██╔══╝  ██║╚██╔╝██║    ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
echo ╚██████╗██║  ██║██║     ██║ ╚═╝ ██║    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
echo  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═╝    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
echo.
echo ========================================
echo    CAFM System - Quick Launcher
echo ========================================
echo.

echo [INFO] Checking prerequisites...

echo [1/4] Checking .NET...
dotnet --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] .NET not found! Please install .NET 9 SDK
    echo Download: https://dotnet.microsoft.com/download/dotnet/9.0
    pause
    exit /b 1
)
echo [OK] .NET is installed

echo [2/4] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found! Please install Node.js
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

echo [3/4] Checking SQL Server connection...
sqlcmd -S localhost -E -Q "SELECT 1" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Cannot connect to SQL Server
    echo Please ensure SQL Server is running and database is set up
    echo Check QUICK-SETUP.md for database setup instructions
    echo.
    echo Continue anyway? (Y/N)
    set /p continue=
    if /i "%continue%" NEQ "Y" exit /b 1
)
echo [OK] SQL Server connection available

echo [4/4] Checking project files...
if not exist "CAFMSystem.API" (
    echo [ERROR] CAFMSystem.API folder not found!
    echo Please ensure you're running this from the project root directory
    pause
    exit /b 1
)
if not exist "cafm-system-frontend" (
    echo [ERROR] cafm-system-frontend folder not found!
    echo Please ensure you're running this from the project root directory
    pause
    exit /b 1
)
echo [OK] Project files found

echo.
echo ========================================
echo    Starting CAFM System...
echo ========================================
echo.

echo [BACKEND] Starting API server...
start "CAFM Backend API" cmd /k "cd CAFMSystem.API && echo Starting Backend API on http://localhost:5000... && echo. && dotnet run"

echo [WAIT] Waiting for backend to initialize...
timeout /t 15 /nobreak

echo [FRONTEND] Installing dependencies (if needed)...
cd cafm-system-frontend
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
)

echo [FRONTEND] Starting React development server...
start "CAFM Frontend" cmd /k "echo Starting Frontend on http://localhost:5173... && echo. && npm start"

cd ..

echo.
echo ========================================
echo    CAFM System Started Successfully!
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:5173
echo.
echo Default Login Credentials:
echo Admin:  admin@cafm.com / Admin123!
echo User:   user@cafm.com / User123!
echo.
echo ========================================
echo.
echo The system is now running in separate windows.
echo Close those windows to stop the system.
echo.
echo Press any key to close this launcher...
pause >nul
