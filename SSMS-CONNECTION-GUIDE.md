# 🎯 SSMS Connection & Database Setup Guide

## 📋 **Current Status**
✅ Backend source code created  
✅ SQL Server packages installed  
✅ Database migration ready  
✅ Connection strings configured  
🎯 **Next**: Connect SSMS and create database  

## 🔧 **Step 1: Connect to SQL Server with SSMS**

### **Try these connection options in SSMS:**

1. **Option 1 - LocalDB (Recommended)**
   - Server Name: `(localdb)\MSSQLLocalDB`
   - Authentication: Windows Authentication
   - Click "Connect"

2. **Option 2 - Local SQL Server**
   - Server Name: `localhost`
   - Authentication: Windows Authentication
   - Click "Connect"

3. **Option 3 - SQL Server Express**
   - Server Name: `.\SQLEXPRESS`
   - Authentication: Windows Authentication
   - Click "Connect"

4. **Option 4 - Named Instance**
   - Server Name: `zam\SQLEXPRESS`
   - Authentication: Windows Authentication
   - Click "Connect"

## 🗄️ **Step 2: Create CAFM Database**

Once connected to SSMS:

1. **Right-click on "Databases"** in Object Explorer
2. **Select "New Database..."**
3. **Database name**: `CAFMSystem`
4. **Click "OK"**

**OR** run the SQL script:
```sql
-- Copy and paste this in SSMS Query window
CREATE DATABASE CAFMSystem;
```

## 🚀 **Step 3: Run Database Migration**

Open terminal in your project folder and run:

```bash
cd CAFMSystem.API
dotnet ef database update
```

This will create all tables and seed default users.

## 👥 **Step 4: Default User Accounts**

After migration, these accounts will be available:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@cafm.com | Admin123! | System Administrator |
| **AssetManager** | manager@cafm.com | Manager123! | Asset Manager |
| **Plumber** | plumber@cafm.com | Plumber123! | Maintenance - Plumbing |
| **Electrician** | electrician@cafm.com | Electric123! | Maintenance - Electrical |
| **EndUser** | user@cafm.com | User123! | Regular User |

## 🧪 **Step 5: Test the Connection**

1. **Start the backend**:
   ```bash
   cd CAFMSystem.API
   dotnet run
   ```

2. **Open Swagger UI**: http://localhost:5000/swagger

3. **Test login endpoint** with admin credentials

## 🔍 **Step 6: Verify in SSMS**

After running the migration, check in SSMS:

1. **Expand CAFMSystem database**
2. **Expand Tables** - you should see:
   - AspNetUsers
   - AspNetRoles
   - AspNetUserRoles
   - Tickets
   - TicketComments
   - And other Identity tables

3. **Check data**:
   ```sql
   USE CAFMSystem;
   
   -- Check users
   SELECT Email, FirstName, LastName, Department 
   FROM AspNetUsers;
   
   -- Check roles
   SELECT Name FROM AspNetRoles;
   ```

## ⚠️ **Troubleshooting**

### **If SSMS won't connect:**

1. **Check SQL Server services**:
   - Press `Win + R`, type `services.msc`
   - Look for "SQL Server" services
   - Make sure they're running

2. **Try SQL Server Configuration Manager**:
   - Enable TCP/IP protocol
   - Restart SQL Server service

3. **Alternative: Use LocalDB**:
   - Update connection string to use LocalDB
   - No separate SQL Server installation needed

### **If migration fails:**

1. **Check connection string** in appsettings.json
2. **Ensure database exists** in SSMS
3. **Run with verbose logging**:
   ```bash
   dotnet ef database update --verbose
   ```

## 🎉 **Success Indicators**

✅ SSMS connects successfully  
✅ CAFMSystem database created  
✅ Migration runs without errors  
✅ Default users are seeded  
✅ Backend starts on http://localhost:5000  
✅ Swagger UI loads  
✅ Login works with test credentials  

## 📞 **Next Steps After Success**

1. **Test frontend connection** to backend
2. **Verify user authentication** works
3. **Create additional users** if needed
4. **Set up production environment** if required

---

**🔥 Ready to proceed? Let me know which connection option worked for you!**
