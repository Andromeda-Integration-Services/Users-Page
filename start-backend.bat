@echo off
echo ========================================
echo    CAFM System - Starting Backend
echo ========================================
echo.

REM Check for .NET 9.0 version first, then fall back to 7.0
if exist "CAFMSystem.API\bin\Debug\net9.0\CAFMSystem.API.exe" (
    echo Using .NET 9.0 version...
    cd "CAFMSystem.API\bin\Debug\net9.0"
) else if exist "CAFMSystem.API\bin\Debug\net7.0\CAFMSystem.API.exe" (
    echo Using .NET 7.0 version...
    cd "CAFMSystem.API\bin\Debug\net7.0"
) else (
    echo ❌ ERROR: Backend executable not found!
    echo 💡 Please build the backend first: cd CAFMSystem.API && dotnet build
    pause
    exit /b 1
)

echo Starting backend API on http://localhost:5000...
echo.
echo Press Ctrl+C to stop the backend
echo.
echo 🔧 Backend API will be available at: http://localhost:5000
echo 📚 API Documentation: http://localhost:5000/swagger
echo.
set ASPNETCORE_URLS=http://localhost:5000
CAFMSystem.API.exe
