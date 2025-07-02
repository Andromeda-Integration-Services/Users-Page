# 🗄️ CAFM Database Portability Guide

Just like your PHP projects with MySQL exports, here's how to make your MSSQL database portable across any PC!

## 🚀 **Method 1: SQL Script Export/Import (Recommended)**

### **📁 Files You Need:**
- `Database-Export-Complete.sql` - Complete database schema + data
- `Setup-Database.ps1` - PowerShell setup script
- `setup-database.bat` - Batch file alternative

### **🎯 How to Use (Super Easy!):**

#### **On Any New PC:**
1. **Install SQL Server** (Express is free)
2. **Copy your project folder**
3. **Run setup script:**
   ```powershell
   # Option 1: PowerShell (Recommended)
   .\Setup-Database.ps1
   
   # Option 2: Command Prompt
   setup-database.bat
   ```
4. **Done!** Your database is ready with all users and data

### **🔑 Login Credentials (Always the Same):**
- **Admin**: `admin@cafm.com` / `Admin123!`
- **User**: `user@cafm.com` / `User123!`
- **Manager**: `manager@cafm.com` / `Manager123!`
- **Plumber**: `plumber@cafm.com` / `Plumber123!`
- **Electrician**: `electrician@cafm.com` / `Electric123!`
- **Cleaner**: `inzamam@cafm.com` / `Cleaner123!`

---

## 🔧 **Method 2: Manual SQL Import**

If scripts don't work, run manually:

```sql
-- 1. Open SQL Server Management Studio (SSMS)
-- 2. Connect to your SQL Server
-- 3. Open Database-Export-Complete.sql
-- 4. Execute the script
-- 5. Done!
```

---

## 📦 **Method 3: Database Backup/Restore (Advanced)**

### **Create Backup (On Source PC):**
```sql
BACKUP DATABASE CAFMSystem 
TO DISK = 'C:\Backup\CAFMSystem.bak'
WITH FORMAT, INIT;
```

### **Restore Backup (On Target PC):**
```sql
RESTORE DATABASE CAFMSystem 
FROM DISK = 'C:\Backup\CAFMSystem.bak'
WITH REPLACE;
```

---

## 🛠️ **Method 4: Connection String Flexibility**

Your `appsettings.json` supports multiple connection options:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "LocalServer": "Server=localhost;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "SqlExpress": "Server=.\\SQLEXPRESS;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true",
    "NamedInstance": "Server=YourPC\\SQLEXPRESS;Database=CAFMSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

---

## 🎯 **Quick Setup Checklist**

### **Prerequisites:**
- [ ] SQL Server installed (Express/Developer/Standard)
- [ ] .NET 8 SDK installed
- [ ] Node.js installed (for frontend)

### **Setup Steps:**
1. [ ] Copy project folder to new PC
2. [ ] Run `Setup-Database.ps1` or `setup-database.bat`
3. [ ] Navigate to `CAFMSystem.API` folder
4. [ ] Run `dotnet run` (backend starts on localhost:5000)
5. [ ] Navigate to `cafm-system-frontend` folder
6. [ ] Run `npm install` then `npm run dev` (frontend starts on localhost:5173)
7. [ ] Open browser: `http://localhost:5173`
8. [ ] Login with any credentials above

---

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"Cannot connect to SQL Server"**
- Check if SQL Server service is running
- Try different connection strings in appsettings.json
- Use SQL Server Configuration Manager

#### **"Database already exists"**
- The script will recreate the database automatically
- Or manually drop: `DROP DATABASE CAFMSystem`

#### **"Permission denied"**
- Run PowerShell/Command Prompt as Administrator
- Ensure your Windows user has SQL Server permissions

#### **"SqlServer module not found"**
```powershell
Install-Module -Name SqlServer -Force
```

---

## 🎉 **Success Indicators**

When everything works, you should see:
- ✅ Database created with 6 users
- ✅ Sample tickets loaded
- ✅ Backend API responding on localhost:5000
- ✅ Frontend loading on localhost:5173
- ✅ Login working with provided credentials
- ✅ Tickets displaying in the UI

---

## 📝 **Notes**

- **Password Hashes**: The SQL script includes placeholder hashes. After import, the system will automatically reset passwords on first use.
- **Data Persistence**: All your tickets and user data will be preserved
- **Version Control**: Keep `Database-Export-Complete.sql` updated when you make schema changes
- **Backup Strategy**: Regular backups recommended for production use

---

**🎯 This gives you the same "smooth AF" experience as your PHP/MySQL projects!** 🚀
