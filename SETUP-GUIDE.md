# 🚀 CAFM System - Complete Setup Guide for Any PC

## 📋 Prerequisites Checklist

Before starting, ensure your target PC has these installed:

### ✅ Required Software:
1. **.NET 9.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/9.0)
2. **SQL Server** (Express/Developer/Standard) - [Download here](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
3. **SQL Server Management Studio (SSMS)** - [Download here](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
4. **Node.js (v18+)** - [Download here](https://nodejs.org/)
5. **Git** (optional) - [Download here](https://git-scm.com/)

### 🔍 Verify Installation:
```bash
# Check .NET version (should show 9.x.x)
dotnet --version

# Check Node.js version (should show 18.x.x or higher)
node --version
npm --version

# Check SQL Server connection
sqlcmd -S localhost -E
```

## 📁 Project Structure
```
CAFM-System/
├── CAFMSystem.API/              # Backend (.NET Web API)
├── cafm-system-frontend/        # Frontend (React + Vite)
├── Database/                    # Database setup files
│   ├── Complete-Database-Export.sql
│   ├── Fresh-Setup.sql
│   └── setup-database.bat
├── Scripts/                     # Utility scripts
├── SETUP-GUIDE.md              # This file
└── README.md                   # Project documentation
```

## 🗄️ Database Setup (Choose One Method)

### 🎯 Method 1: Complete Database Import (Recommended - Like phpMyAdmin)

This is similar to importing SQL files in phpMyAdmin:

1. **Open SQL Server Management Studio (SSMS)**
2. **Connect to your SQL Server instance** (usually `localhost` or `.\SQLEXPRESS`)
3. **Open the SQL file**: File → Open → File → Select `Database/Complete-Database-Export.sql`
4. **Execute the script**: Press F5 or click Execute
5. **Verify**: You should see `CAFMSystem` database created with all tables and data

```sql
-- Alternative: Run via command line
sqlcmd -S localhost -E -i "Database/Complete-Database-Export.sql"
```

### 🔧 Method 2: Fresh Setup (Clean Database)
```bash
# Option A: Use automated script
cd CAFMSystem.API
setup-database.bat

# Option B: Manual setup in SSMS
# 1. Execute: Database/Fresh-Setup.sql
# 2. Run the application once to seed initial data
```

### 📊 Method 3: Restore from Backup File (.bak)
If you have a `.bak` backup file:
```sql
-- In SSMS, run this query
RESTORE DATABASE CAFMSystem 
FROM DISK = 'C:\Path\To\Your\CAFMSystem.bak'
WITH REPLACE;
```

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd CAFMSystem.API
```

### 2. Update Connection String (if needed)
Edit `appsettings.json` and update for your SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CAFMSystem;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

**Common Connection String Variations:**
```json
// For SQL Server Express
"Server=localhost\\SQLEXPRESS;Database=CAFMSystem;Trusted_Connection=true;TrustServerCertificate=true;"

// For named instance
"Server=localhost\\INSTANCENAME;Database=CAFMSystem;Trusted_Connection=true;TrustServerCertificate=true;"

// For SQL Server with username/password
"Server=localhost;Database=CAFMSystem;User Id=sa;Password=YourPassword;TrustServerCertificate=true;"
```

### 3. Restore Dependencies and Build
```bash
# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the backend (starts on http://localhost:5000)
dotnet run
```

### 4. Verify Backend is Working
Open browser and test: `http://localhost:5000/api/tickets/stats`
Should return JSON data like:
```json
{"totalTickets":1,"openTickets":1,"inProgressTickets":0...}
```

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd cafm-system-frontend
```

### 2. Install Dependencies
```bash
# Install npm packages (this may take a few minutes)
npm install

# Fix any vulnerabilities (optional)
npm audit fix
```

### 3. Start Development Server
```bash
# Start frontend (will start on http://localhost:5173)
npm start
```

### 4. Verify Frontend
Open browser: `http://localhost:5173`
You should see the CAFM System login page.

## 🔐 Default Login Credentials

### 👨‍💼 Admin Account:
- **Email:** admin@cafm.com
- **Password:** Admin123!
- **Access:** Full system access, admin dashboard

### 👤 Regular User Account:
- **Email:** user@cafm.com  
- **Password:** User123!
- **Access:** Create tickets, view own tickets

## 🚀 Quick Start Script

Create `start-project.bat` in the root directory for easy startup:

```batch
@echo off
echo ========================================
echo    CAFM System - Quick Start
echo ========================================

echo.
echo [1/3] Starting Backend API...
start "CAFM Backend" cmd /k "cd CAFMSystem.API && echo Starting Backend... && dotnet run"

echo.
echo [2/3] Waiting for backend to initialize...
timeout /t 15

echo.
echo [3/3] Starting Frontend...
start "CAFM Frontend" cmd /k "cd cafm-system-frontend && echo Starting Frontend... && npm start"

echo.
echo ========================================
echo CAFM System is starting up...
echo.
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:5173
echo.
echo Login with: admin@cafm.com / Admin123!
echo ========================================
echo.
echo Press any key to close this window...
pause
```

## 📊 Database Backup & Restore (Like phpMyAdmin Export/Import)

### 🔄 Creating Database Backup:

#### Method 1: SQL Script Export (Like phpMyAdmin)
1. **In SSMS**: Right-click `CAFMSystem` database
2. **Tasks** → **Generate Scripts...**
3. **Script Wizard**: Choose "Script entire database and all database objects"
4. **Advanced Options** → **Types of data to script** → "Schema and data"
5. **Save to file**: Choose location and filename
6. **Execute**: Creates a complete SQL script file

#### Method 2: Binary Backup (.bak file)
```sql
-- In SSMS, run this query
BACKUP DATABASE CAFMSystem 
TO DISK = 'C:\Backup\CAFMSystem_Backup.bak'
WITH FORMAT, INIT, COMPRESSION;
```

### 📥 Restoring Database Backup:

#### Method 1: From SQL Script (Like phpMyAdmin Import)
1. **In SSMS**: File → Open → File → Select your `.sql` file
2. **Execute**: Press F5 or click Execute
3. **Verify**: Check that database and tables are created

#### Method 2: From Binary Backup (.bak file)
```sql
-- In SSMS, run this query
RESTORE DATABASE CAFMSystem 
FROM DISK = 'C:\Backup\CAFMSystem_Backup.bak'
WITH REPLACE;
```

## 🔧 Troubleshooting Common Issues

### ❌ Issue 1: Port Already in Use
```bash
# Kill existing processes
taskkill /F /IM dotnet.exe
taskkill /F /IM node.exe

# Or use different ports
dotnet run --urls="http://localhost:5001"
npm start -- --port 5174
```

### ❌ Issue 2: Database Connection Failed
**Check these:**
- SQL Server service is running
- Connection string is correct
- Windows Authentication is enabled
- Firewall is not blocking connections

**Test connection:**
```bash
sqlcmd -S localhost -E
```

### ❌ Issue 3: Frontend Won't Start
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ Issue 4: CORS Errors
- Ensure backend is running on `localhost:5000`
- Check CORS configuration in `Program.cs`
- Verify frontend is accessing correct backend URL

## 📁 Files to Copy When Moving to Another PC

### ✅ Essential Files Checklist:
- [ ] Complete project source code
- [ ] `Database/Complete-Database-Export.sql` (your database backup)
- [ ] `SETUP-GUIDE.md` (this file)
- [ ] `start-project.bat` (quick start script)
- [ ] Configuration files (`appsettings.json`, `package.json`)

### 📦 Recommended: Create Portable Package
1. Copy entire project folder
2. Include database export SQL file
3. Include this setup guide
4. Test on target PC following this guide

## 🌐 Production Deployment Notes

For production environment:
- Update `appsettings.Production.json`
- Use proper SQL Server (not Express)
- Configure IIS or reverse proxy
- Set up HTTPS certificates
- Update CORS origins for production domain

---

## 🎯 Quick Commands Summary

```bash
# 1. Setup Database (choose one)
sqlcmd -S localhost -E -i "Database/Complete-Database-Export.sql"

# 2. Start Backend
cd CAFMSystem.API && dotnet run

# 3. Start Frontend  
cd cafm-system-frontend && npm start

# 4. Access Application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Login: admin@cafm.com / Admin123!
```

**🚨 IMPORTANT: Project must run on localhost:5173 - Never change this port!**

---

## 📞 Need Help?

If you encounter issues:
1. ✅ Check this guide first
2. ✅ Verify all prerequisites are installed  
3. ✅ Test database connection
4. ✅ Ensure ports 5000 and 5173 are available
5. ✅ Check console for error messages
