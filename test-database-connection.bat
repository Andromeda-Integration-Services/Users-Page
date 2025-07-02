@echo off
echo ========================================
echo    CAFM Database Connection Tester
echo ========================================
echo.

echo 🎯 Testing different SQL Server connections...
echo.

echo 1. Testing LocalDB connection...
echo Connection: (localdb)\MSSQLLocalDB
cd CAFMSystem.API
dotnet ef database update --connection "Server=(localdb)\MSSQLLocalDB;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"

if %ERRORLEVEL% EQU 0 (
    echo ✅ LocalDB connection successful!
    echo.
    echo 🚀 Starting backend with LocalDB...
    echo Backend will run on: http://localhost:5000
    echo Swagger UI: http://localhost:5000/swagger
    echo.
    echo 👥 Default login credentials:
    echo    Admin: admin@cafm.com / Admin123!
    echo    User:  user@cafm.com / User123!
    echo.
    dotnet run
) else (
    echo ❌ LocalDB connection failed. Trying localhost...
    echo.
    
    echo 2. Testing localhost connection...
    dotnet ef database update --connection "Server=localhost;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Localhost connection successful!
        echo.
        echo 🚀 Starting backend with localhost...
        dotnet run
    ) else (
        echo ❌ Localhost connection failed. Trying SQL Express...
        echo.
        
        echo 3. Testing SQL Express connection...
        dotnet ef database update --connection "Server=.\SQLEXPRESS;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
        
        if %ERRORLEVEL% EQU 0 (
            echo ✅ SQL Express connection successful!
            echo.
            echo 🚀 Starting backend with SQL Express...
            dotnet run
        ) else (
            echo ❌ All connection attempts failed!
            echo.
            echo 💡 Please check:
            echo    1. SQL Server is installed and running
            echo    2. SQL Server services are started
            echo    3. Windows Authentication is enabled
            echo    4. Try connecting manually in SSMS first
            echo.
            pause
        )
    )
)

pause
