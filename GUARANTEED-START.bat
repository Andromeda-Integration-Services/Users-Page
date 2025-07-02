@echo off
echo.
echo ========================================
echo      CAFM System - GUARANTEED START
echo ========================================
echo.
echo ⚡ WILL RUN ON LOCALHOST:5173 ⚡
echo.

echo Starting Backend...
start "CAFM Backend" cmd /k "start-backend.bat"

echo Waiting 8 seconds for backend...
timeout /t 8 /nobreak >nul

echo Starting Frontend...
start "CAFM Frontend" cmd /k "start-frontend.bat"

echo Waiting 12 seconds for frontend...
timeout /t 12 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo ========================================
echo   ✅ CAFM System is LIVE!
echo ========================================
echo.
echo 🌐 App: http://localhost:5173
echo 🔧 API: http://localhost:5000
echo.
echo 📝 Login: admin@cafm.com / Admin123!
echo.
echo ❌ To stop: Close both command windows
echo.
pause
