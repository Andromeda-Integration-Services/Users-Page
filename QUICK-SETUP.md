# 🚀 CAFM System - QUICK SETUP (Any PC)

## 📋 What You Need (5 minutes install)

1. **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
2. **SQL Server Express** - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (Choose Express)
3. **SSMS** - [Download](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
4. **Node.js** - [Download](https://nodejs.org/) (LTS version)

## 🗄️ Database Setup (Like phpMyAdmin - Super Easy!)

### Step 1: Get Your Database File
I'll create a simple SQL export file for you. In SSMS:

1. **Right-click your CAFMSystem database**
2. **Tasks → Generate Scripts...**
3. **Choose "Script entire database and all database objects"**
4. **Advanced → Types of data to script → "Schema and data"**
5. **Save as:** `CAFMSystem-Complete.sql`

### Step 2: Import on New PC (Just like phpMyAdmin!)
1. **Open SSMS on new PC**
2. **Connect to SQL Server**
3. **File → Open → File → Select your `CAFMSystem-Complete.sql`**
4. **Press F5 to execute**
5. **Done!** Database is ready

## 🚀 Run Project (2 commands only!)

### Backend:
```bash
cd CAFMSystem.API
dotnet run
```

### Frontend:
```bash
cd cafm-system-frontend
npm install
npm start
```

## 🔐 Login
- **Admin:** admin@cafm.com / Admin123!
- **User:** user@cafm.com / User123!

## 📁 Files to Copy to New PC
```
Your-Project-Folder/
├── CAFMSystem.API/          (entire folder)
├── cafm-system-frontend/    (entire folder)
├── CAFMSystem-Complete.sql  (your database export)
└── QUICK-SETUP.md          (this file)
```

## 🔧 If Something Goes Wrong

### Database Connection Issues:
Edit `CAFMSystem.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CAFMSystem;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

### Port Issues:
```bash
# Kill existing processes
taskkill /F /IM dotnet.exe
taskkill /F /IM node.exe
```

### Frontend Issues:
```bash
cd cafm-system-frontend
rm -rf node_modules
npm install
```

## ✅ Quick Test
1. Backend: `http://localhost:5000/api/tickets/stats` (should show JSON)
2. Frontend: `http://localhost:5173` (should show login page)

**That's it! Your project runs on any PC! 🎉**
