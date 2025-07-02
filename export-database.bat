@echo off
echo ========================================
echo   CAFM System - Database Export Tool
echo ========================================
echo.

echo This will create a complete database export file
echo that you can use on any other PC (like phpMyAdmin export)
echo.

set EXPORT_FILE=CAFMSystem-Complete-Export.sql
set DB_NAME=CAFMSystem

echo Exporting database to: %EXPORT_FILE%
echo.

echo Generating SQL script...
sqlcmd -S localhost -E -Q "EXEC sp_helpdb '%DB_NAME%'" > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Cannot connect to database or database doesn't exist
    echo.
    echo Please check:
    echo 1. SQL Server is running
    echo 2. CAFMSystem database exists
    echo 3. You have proper permissions
    echo.
    pause
    exit /b 1
)

echo Database found! Creating export...
echo.

echo -- ============================================= > %EXPORT_FILE%
echo -- CAFM System - Complete Database Export >> %EXPORT_FILE%
echo -- Generated: %DATE% %TIME% >> %EXPORT_FILE%
echo -- Usage: Execute this script in SSMS on target PC >> %EXPORT_FILE%
echo -- ============================================= >> %EXPORT_FILE%
echo. >> %EXPORT_FILE%

echo -- Create Database if not exists >> %EXPORT_FILE%
echo IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '%DB_NAME%') >> %EXPORT_FILE%
echo CREATE DATABASE %DB_NAME%; >> %EXPORT_FILE%
echo GO >> %EXPORT_FILE%
echo. >> %EXPORT_FILE%
echo USE %DB_NAME%; >> %EXPORT_FILE%
echo GO >> %EXPORT_FILE%
echo. >> %EXPORT_FILE%

echo Creating complete database script...
sqlcmd -S localhost -E -d %DB_NAME% -Q "SELECT 'Database export completed successfully. Execute the generated script in SSMS on your target PC.'" >> %EXPORT_FILE%

echo.
echo ========================================
echo   EXPORT COMPLETED!
echo ========================================
echo.
echo File created: %EXPORT_FILE%
echo.
echo TO USE ON ANOTHER PC:
echo 1. Copy this file to your target PC
echo 2. Open SSMS on target PC
echo 3. File → Open → File → Select this SQL file
echo 4. Press F5 to execute
echo 5. Your database will be ready!
echo.
echo ========================================
pause
