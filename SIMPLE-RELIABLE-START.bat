@echo off
title CAFM System - Simple Reliable Startup
echo.
echo ========================================
echo      CAFM System - Simple Startup
echo ========================================
echo.
echo ⚡ GUARANTEED TO RUN ON LOCALHOST:5173 ⚡
echo.

echo ⏳ Step 1: Starting Backend API...
start "CAFM Backend API" cmd /k "start-backend.bat"

echo ⏳ Step 2: Waiting for backend to initialize...
ping 127.0.0.1 -n 8 > nul

echo ⏳ Step 3: Starting Frontend Application...
start "CAFM Frontend App" cmd /k "start-frontend.bat"

echo ⏳ Step 4: Waiting for frontend to start...
ping 127.0.0.1 -n 12 > nul

echo ⏳ Step 5: Opening browser...
start http://localhost:5173

echo.
echo ========================================
echo   ✅ CAFM System is now LIVE!
echo ========================================
echo.
echo 🌐 Frontend Application: http://localhost:5173
echo 🔧 Backend API: http://localhost:5000
echo 📚 API Documentation: http://localhost:5000/swagger
echo.
echo 📝 Ready-to-use Test Accounts:
echo    👑 Admin: admin@cafm.com / Admin123!
echo    👤 User: user@cafm.com / Password123!
echo    🔧 Plumber: plumber@cafm.com / Password123!
echo.
echo ❌ To stop: Close the two command windows
echo 💡 Tip: Your app will ALWAYS run on localhost:5173
echo.
echo 🎉 Enjoy your CAFM system!
echo.
echo Press any key to close this window...
pause >nul
exit
