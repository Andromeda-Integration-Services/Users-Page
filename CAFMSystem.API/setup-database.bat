@echo off
echo =============================================
echo CAFM System - Database Setup
echo =============================================
echo.
echo This will create the CAFMSystem database on your local SQL Server.
echo.
pause

echo.
echo Setting up database...
sqlcmd -S localhost -E -i "Database-Export-Complete.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =============================================
    echo SUCCESS! Database setup completed.
    echo =============================================
    echo.
    echo Your CAFM database is ready!
    echo You can now run the backend with: dotnet run
    echo.
    echo Login credentials:
    echo - Admin: admin@cafm.com / Admin123!
    echo - User: user@cafm.com / User123!
    echo.
) else (
    echo.
    echo =============================================
    echo ERROR! Database setup failed.
    echo =============================================
    echo.
    echo Please check:
    echo 1. SQL Server is running
    echo 2. You have permissions to create databases
    echo 3. sqlcmd is installed and in PATH
    echo.
)

pause
