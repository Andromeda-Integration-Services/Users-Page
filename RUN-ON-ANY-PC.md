# 🚀 CAFM System - Run on ANY PC (Super Simple!)

## 📦 What You Need to Copy to New PC

```
Your-CAFM-Project/
├── CAFMSystem.API/              (entire backend folder)
├── cafm-system-frontend/        (entire frontend folder)
├── CAFMSystem-Database.sql      (database export file)
├── START-CAFM.bat              (auto-start script)
├── QUICK-SETUP.md              (setup instructions)
└── RUN-ON-ANY-PC.md            (this file)
```

## 🔧 Prerequisites (5-minute install)

**Install these on target PC:**
1. **.NET 9 SDK** → https://dotnet.microsoft.com/download/dotnet/9.0
2. **SQL Server Express** → https://www.microsoft.com/sql-server/sql-server-downloads
3. **SSMS** → https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
4. **Node.js** → https://nodejs.org/ (LTS version)

## 🗄️ Database Setup (Just like phpMyAdmin!)

### Step 1: Import Database
1. **Open SSMS** on new PC
2. **Connect** to SQL Server (usually `localhost`)
3. **File → Open → File** → Select `CAFMSystem-Database.sql`
4. **Press F5** to execute
5. **Done!** Database ready with all data

### Alternative: Command Line
```bash
sqlcmd -S localhost -E -i "CAFMSystem-Database.sql"
```

## 🚀 Run Project (2 Steps Only!)

### Option 1: Auto-Start (Easiest)
**Double-click:** `START-CAFM.bat`
- Automatically starts backend and frontend
- Opens in separate windows
- Shows all URLs and login info

### Option 2: Manual Start
```bash
# Terminal 1: Backend
cd CAFMSystem.API
dotnet run

# Terminal 2: Frontend  
cd cafm-system-frontend
npm install
npm start
```

## 🌐 Access Your System

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@cafm.com | Admin123! |
| **User** | user@cafm.com | User123! |
| **Manager** | manager@cafm.com | Manager123! |
| **Plumber** | plumber@cafm.com | Plumber123! |
| **Electrician** | electrician@cafm.com | Electric123! |
| **Cleaner** | inzamam@cafm.com | Cleaner123! |

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

### Port Conflicts:
```bash
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

1. **Backend Test:** http://localhost:5000/api/tickets/stats
   - Should show JSON data
2. **Frontend Test:** http://localhost:5173
   - Should show login page
3. **Login Test:** Use admin@cafm.com / Admin123!
   - Should access admin dashboard

## 📊 Database Backup/Export (For Future Moves)

### Create New Export:
1. **SSMS** → Right-click `CAFMSystem` database
2. **Tasks → Generate Scripts...**
3. **Script entire database and all database objects**
4. **Advanced → Types of data to script → "Schema and data"**
5. **Save as:** `CAFMSystem-New-Export.sql`

### Command Line Export:
```bash
sqlcmd -S localhost -E -Q "BACKUP DATABASE CAFMSystem TO DISK = 'C:\CAFMSystem-Backup.bak'"
```

## 🎯 That's It!

**Your CAFM System now runs on any PC with these simple steps:**

1. ✅ Install prerequisites (5 minutes)
2. ✅ Copy project files
3. ✅ Import database (1 click in SSMS)
4. ✅ Double-click `START-CAFM.bat`
5. ✅ Access http://localhost:5173

**Just like phpMyAdmin export/import - but for .NET! 🎉**

---

## 📞 Need Help?

**Check in order:**
1. Prerequisites installed?
2. Database imported successfully?
3. Ports 5000 and 5173 available?
4. Check console for error messages

**Project must run on localhost:5173 - Never change this!**
