🚀 Method 1: SQL Script Import (Easiest for SSMS)
On any new PC with SSMS:

Copy your project folder to the new PC
Open SSMS and connect to SQL Server
Open the SQL file: CAFMSystem.API/Database-Export-Complete.sql
Execute the script (F5)
Done! Your database is ready with all users and data
Login credentials after import:

Admin: admin@cafm.com / Admin123!
User: user@cafm.com / User123!
Manager: manager@cafm.com / Manager123!
Plumber: plumber@cafm.com / Plumber123!
Electrician: electrician@cafm.com / Electric123!
Cleaner: inzamam@cafm.com / Cleaner123!

Method 2: PowerShell Setup (Automated)
On any new PC:

# Navigate to your project
cd "CAFMSystem.API"

# Run the setup script
.\Setup-Database.ps1

💾 Method 3: Create Fresh Backup from Current Database
To create a new backup from your current working database:

Open SSMS
Right-click your CAFMSystem database
Tasks → Back Up...
Choose backup location (e.g., CAFMSystem-Backup.bak)
Click OK
To restore on another PC:

-- In SSMS, run this query
RESTORE DATABASE CAFMSystem 
FROM DISK = 'C:\Path\To\Your\CAFMSystem-Backup.bak'
WITH REPLACE;

 Method 4: Export Current Data to SQL Script
To create a fresh export with your current data:

In SSMS, right-click CAFMSystem database
Tasks → Generate Scripts...
Choose "Script entire database and all database objects"
Advanced Options → Types of data to script: "Data only" or "Schema and data"
Save to file
📋 Connection Strings for Different Environments
Your appsettings.json already supports multiple SQL Server setups:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "LocalServer": "Server=localhost;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "SqlExpress": "Server=.\\SQLEXPRESS;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "NamedInstance": "Server=zam\\SQLEXPRESS;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}


Quick Migration Steps for Remote Desktop
Copy your entire project folder to the remote desktop
Install SQL Server (if not already installed)
Run one of these options:
Execute Database-Export-Complete.sql in SSMS
Run Setup-Database.ps1 in PowerShell
Use the batch file: setup-database.bat
Update connection string if needed (different server name)
Run your project: dotnet run
✅ Verification Steps
After importing the database:

Check in SSMS:
USE CAFMSystem;

-- Check users
SELECT Email, FirstName, LastName, Department 
FROM AspNetUsers;

-- Check roles
SELECT Name FROM AspNetRoles;

-- Check tickets
SELECT Title, Status, CreatedAt FROM Tickets;


Test the application:
Start backend: dotnet run
Open: http://localhost:5000/swagger
Login with admin credentials
🎉 You're All Set!