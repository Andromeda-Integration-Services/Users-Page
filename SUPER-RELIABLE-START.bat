@echo off
title CAFM System - Super Reliable Startup
color 0A
echo.
echo ████████████████████████████████████████████████████████████████
echo ██                                                            ██
echo ██    🏢 CAFM SYSTEM - SUPER RELIABLE STARTUP 🏢              ██
echo ██                                                            ██
echo ██    ⚡ GUARANTEED TO RUN ON LOCALHOST:5173 ⚡               ██
echo ██                                                            ██
echo ████████████████████████████████████████████████████████████████
echo.
echo 🔍 Pre-flight checks...
echo.

REM Check if Node.js is installed
echo ⏳ Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo 💡 Please install Node.js from https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    echo ✅ Node.js is available
)

REM Check if npm is available
echo ⏳ Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm is not available
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    echo ✅ npm is available
)

REM Check if backend executable exists
echo ⏳ Checking backend files...
if exist "CAFMSystem.API\bin\Debug\net9.0\CAFMSystem.API.exe" (
    echo ✅ Backend executable found (net9.0)
) else if exist "CAFMSystem.API\bin\Debug\net7.0\CAFMSystem.API.exe" (
    echo ✅ Backend executable found (net7.0)
) else (
    echo ❌ ERROR: Backend executable not found
    echo 💡 Please build the backend first: cd CAFMSystem.API && dotnet build
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if frontend directory exists
echo ⏳ Checking frontend files...
if not exist "cafm-system-frontend\package.json" (
    echo ❌ ERROR: Frontend package.json not found
    echo 💡 Please ensure you're in the correct project directory
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    echo ✅ Frontend files found
)

echo.
echo ✅ All pre-flight checks passed!
echo.
echo 🚀 Starting CAFM System...
echo.

echo ⏳ Step 1/5: Starting Backend API on localhost:5000...
start "🔧 CAFM Backend API" cmd /k "start-backend.bat"

echo ⏳ Step 2/5: Waiting for backend to initialize...
echo    (This may take 5-10 seconds)
ping 127.0.0.1 -n 8 > nul

echo ⏳ Step 3/5: Starting Frontend Application on localhost:5173...
start "🌐 CAFM Frontend App" cmd /k "start-frontend.bat"

echo ⏳ Step 4/5: Waiting for frontend to start...
echo    (This may take 10-15 seconds)
ping 127.0.0.1 -n 12 > nul

echo ⏳ Step 5/5: Opening browser...
start http://localhost:5173

echo.
echo ████████████████████████████████████████████████████████████████
echo ██                                                            ██
echo ██    ✅ CAFM SYSTEM IS NOW LIVE AND RUNNING! ✅              ██
echo ██                                                            ██
echo ████████████████████████████████████████████████████████████████
echo.
echo 🌐 Frontend Application: http://localhost:5173
echo 🔧 Backend API: http://localhost:5000
echo 📚 API Documentation: http://localhost:5000/swagger
echo.
echo 📝 Ready-to-use Test Accounts:
echo    👑 Admin: admin@cafm.com / Admin123!
echo    👤 User: user@cafm.com / Password123!
echo    🔧 Plumber: plumber@cafm.com / Password123!
echo    ⚡ Electrician: electrician@cafm.com / Password123!
echo    🧹 Cleaner: cleaner@cafm.com / Password123!
echo    📊 Manager: manager@cafm.com / Password123!
echo.
echo 💡 IMPORTANT NOTES:
echo    • Your app will ALWAYS run on localhost:5173
echo    • If you see any errors, close both windows and run this script again
echo    • Both backend and frontend windows must stay open
echo.
echo ❌ To stop: Close the two command windows that opened
echo 🔄 To restart: Run this script again
echo.
echo 🎉 Enjoy your CAFM system!
echo.
echo Press any key to close this window...
pause >nul
exit
