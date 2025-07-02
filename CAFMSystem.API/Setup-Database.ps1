# CAFM System - Database Setup PowerShell Script
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "CAFM System - Database Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if SQL Server is accessible
Write-Host "Checking SQL Server connection..." -ForegroundColor Yellow
try {
    $testConnection = Invoke-Sqlcmd -ServerInstance "localhost" -Query "SELECT 1" -ErrorAction Stop
    Write-Host "✅ SQL Server connection successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to SQL Server!" -ForegroundColor Red
    Write-Host "Please ensure SQL Server is running and accessible." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "This will create the CAFMSystem database with:" -ForegroundColor White
Write-Host "- 6 Users (Admin, EndUser, AssetManager, Plumber, Electrician, Cleaner)" -ForegroundColor White
Write-Host "- Sample tickets" -ForegroundColor White
Write-Host "- All necessary tables and relationships" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow

try {
    # Execute the SQL script
    Invoke-Sqlcmd -ServerInstance "localhost" -InputFile "Database-Export-Complete.sql" -ErrorAction Stop
    
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "SUCCESS! Database setup completed." -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your CAFM database is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login credentials:" -ForegroundColor Cyan
    Write-Host "- Admin: admin@cafm.com / Admin123!" -ForegroundColor White
    Write-Host "- User: user@cafm.com / User123!" -ForegroundColor White
    Write-Host "- Manager: manager@cafm.com / Manager123!" -ForegroundColor White
    Write-Host "- Plumber: plumber@cafm.com / Plumber123!" -ForegroundColor White
    Write-Host "- Electrician: electrician@cafm.com / Electric123!" -ForegroundColor White
    Write-Host "- Cleaner: inzamam@cafm.com / Cleaner123!" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run: dotnet run" -ForegroundColor White
    Write-Host "2. Open frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "3. Login with any of the above credentials" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "ERROR! Database setup failed." -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "1. SQL Server is running" -ForegroundColor White
    Write-Host "2. You have permissions to create databases" -ForegroundColor White
    Write-Host "3. SqlServer PowerShell module is installed" -ForegroundColor White
    Write-Host ""
    Write-Host "To install SqlServer module, run:" -ForegroundColor Yellow
    Write-Host "Install-Module -Name SqlServer -Force" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
