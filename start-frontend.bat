@echo off
echo ========================================
echo    CAFM System - Starting Frontend
echo ========================================
echo.

cd cafm-system-frontend
echo Installing/updating dependencies...
call npm install --legacy-peer-deps --silent
echo.
echo Starting frontend on http://localhost:5173...
echo.
echo Press Ctrl+C to stop the frontend
echo.
echo 🚀 Frontend will be available at: http://localhost:5173
echo.
call npm run dev
