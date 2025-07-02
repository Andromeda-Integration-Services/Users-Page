@echo off
echo.
echo ========================================
echo      CAFM System - DEBUG START
echo ========================================
echo.

echo 🔍 Checking system...
echo.

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ❌ Node.js not found!
    pause
    exit
)

echo Checking npm...
npm --version
if errorlevel 1 (
    echo ❌ npm not found!
    pause
    exit
)

echo Checking backend files...
if exist "CAFMSystem.API\bin\Debug\net9.0\CAFMSystem.API.exe" (
    echo ✅ Found net9.0 backend
) else if exist "CAFMSystem.API\bin\Debug\net7.0\CAFMSystem.API.exe" (
    echo ✅ Found net7.0 backend
) else (
    echo ❌ No backend found!
    pause
    exit
)

echo Checking frontend files...
if exist "cafm-system-frontend\package.json" (
    echo ✅ Frontend files found
) else (
    echo ❌ Frontend files not found!
    pause
    exit
)

echo.
echo ✅ All checks passed!
echo.

echo Starting Backend...
start "CAFM Backend" cmd /k "start-backend.bat"

echo Waiting for backend...
timeout /t 8 /nobreak >nul

echo Starting Frontend...
start "CAFM Frontend" cmd /k "start-frontend.bat"

echo Waiting for frontend...
timeout /t 12 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ✅ CAFM System should be running!
echo.
echo If you see any errors in the command windows,
echo please take a screenshot and let me know.
echo.
pause
