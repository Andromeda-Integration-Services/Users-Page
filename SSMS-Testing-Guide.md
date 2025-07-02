# 🗄️ CAFM System - SSMS Testing Guide

## 📋 **Overview**
This guide provides comprehensive SQL queries for testing the CAFM (Computer-Aided Facility Management) system database using SQL Server Management Studio (SSMS).

---

## 🚀 **Quick Start**

### **1. Connect to Database**
```sql
-- Use this connection string format in SSMS:
-- Server: (your SQL Server instance)
-- Database: CAFMSystem
-- Authentication: Windows Authentication or SQL Server Authentication
```

### **2. Verify Database Connection**
```sql
USE CAFMSystem;
SELECT 'Connected to CAFM Database!' AS Status, GETDATE() AS ConnectedAt;
```

---

## 📁 **Available Query Files**

### **🔍 CAFM-Quick-Test-Queries.sql**
**Purpose**: Fast verification and system overview
**Use Case**: First-time testing, quick health checks
**Contains**:
- Table existence verification
- Data count summaries
- Sample user and ticket data
- Basic relationship checks
- System health indicators

### **📊 CAFM-SSMS-Testing-Queries.sql**
**Purpose**: Comprehensive database analysis
**Use Case**: Detailed system analysis, reporting
**Contains**:
- Complete user management queries
- Ticket workflow analysis
- Performance metrics
- Data quality checks
- Department workload analysis

### **🔬 CAFM-Advanced-Testing-Queries.sql**
**Purpose**: Deep system analysis and diagnostics
**Use Case**: Troubleshooting, advanced analytics
**Contains**:
- Authentication security checks
- Ticket workflow testing
- Performance metrics
- Data integrity validation
- Usage analytics

---

## 🎯 **Testing Scenarios**

### **Scenario 1: Initial System Verification**
```sql
-- Run this first to verify basic system setup
-- File: CAFM-Quick-Test-Queries.sql

-- Expected Results:
-- ✅ All tables exist (Users, Roles, Tickets, Comments)
-- ✅ Sample data is present
-- ✅ No orphaned records
-- ✅ Basic relationships work
```

### **Scenario 2: User Management Testing**
```sql
-- Verify user authentication system
SELECT 
    COUNT(*) AS TotalUsers,
    COUNT(CASE WHEN IsActive = 1 THEN 1 END) AS ActiveUsers,
    COUNT(DISTINCT Department) AS Departments
FROM AspNetUsers;

-- Check role assignments
SELECT r.Name, COUNT(ur.UserId) AS UserCount
FROM AspNetRoles r
LEFT JOIN AspNetUserRoles ur ON r.Id = ur.RoleId
GROUP BY r.Name;
```

### **Scenario 3: Ticket System Testing**
```sql
-- Verify ticket management functionality
SELECT 
    Status,
    COUNT(*) AS TicketCount,
    AVG(DATEDIFF(HOUR, CreatedAt, ISNULL(CompletedAt, GETDATE()))) AS AvgHours
FROM Tickets
GROUP BY Status;
```

### **Scenario 4: Performance Analysis**
```sql
-- Check system performance metrics
SELECT 
    u.Department,
    COUNT(t.Id) AS TotalTickets,
    AVG(DATEDIFF(HOUR, t.CreatedAt, t.CompletedAt)) AS AvgResolutionHours
FROM AspNetUsers u
LEFT JOIN Tickets t ON u.Id = t.AssignedToId
WHERE u.Department IS NOT NULL
GROUP BY u.Department;
```

---

## 📊 **Expected Data Structure**

### **Core Tables**
1. **AspNetUsers** - User accounts with CAFM-specific fields
2. **AspNetRoles** - System roles (Admin, AssetManager, Plumber, etc.)
3. **AspNetUserRoles** - User-role assignments
4. **Tickets** - Service requests and maintenance tickets
5. **TicketComments** - Comments and updates on tickets

### **Key Relationships**
- Users → Tickets (CreatedBy, AssignedTo)
- Tickets → Comments (One-to-Many)
- Users → Roles (Many-to-Many)

### **Sample Data Expectations**
- **6+ Roles**: Admin, AssetManager, Plumber, Electrician, Cleaner, EndUser
- **Test Users**: admin@cafm.com, manager@cafm.com, plumber@cafm.com, etc.
- **Ticket Categories**: General, Plumbing, Electrical, HVAC, Cleaning, Security, IT, Maintenance, Safety
- **Status Values**: Open(1), InProgress(2), OnHold(3), Resolved(4), Closed(5), Cancelled(6)
- **Priority Levels**: Low(1), Medium(2), High(3), Critical(4), Emergency(5)

---

## 🔍 **Common Test Queries**

### **1. User Verification**
```sql
-- Check if test users exist
SELECT Email, FirstName, LastName, Department, IsActive
FROM AspNetUsers
WHERE Email IN (
    'admin@cafm.com', 
    'manager@cafm.com', 
    'plumber@cafm.com',
    'electrician@cafm.com',
    'cleaner@cafm.com',
    'user@cafm.com'
);
```

### **2. Role Assignment Check**
```sql
-- Verify role assignments for test users
SELECT 
    u.Email,
    r.Name AS Role
FROM AspNetUsers u
INNER JOIN AspNetUserRoles ur ON u.Id = ur.UserId
INNER JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE u.Email LIKE '%@cafm.com'
ORDER BY u.Email;
```

### **3. Ticket Data Validation**
```sql
-- Check ticket data integrity
SELECT 
    COUNT(*) AS TotalTickets,
    COUNT(CASE WHEN CreatedById IS NOT NULL THEN 1 END) AS WithCreator,
    COUNT(CASE WHEN AssignedToId IS NOT NULL THEN 1 END) AS WithAssignee,
    COUNT(CASE WHEN Status BETWEEN 1 AND 6 THEN 1 END) AS ValidStatus
FROM Tickets;
```

### **4. System Health Summary**
```sql
-- Overall system health check
SELECT 
    'Users' AS Entity, COUNT(*) AS Count FROM AspNetUsers
UNION ALL
SELECT 'Active Users', COUNT(*) FROM AspNetUsers WHERE IsActive = 1
UNION ALL
SELECT 'Roles', COUNT(*) FROM AspNetRoles
UNION ALL
SELECT 'Tickets', COUNT(*) FROM Tickets
UNION ALL
SELECT 'Open Tickets', COUNT(*) FROM Tickets WHERE Status IN (1,2)
UNION ALL
SELECT 'Comments', COUNT(*) FROM TicketComments;
```

---

## ⚠️ **Troubleshooting**

### **Common Issues**

#### **1. Database Not Found**
```sql
-- Check if database exists
SELECT name FROM sys.databases WHERE name = 'CAFMSystem';

-- If not found, run the setup script first:
-- CAFMSystem.API/Database-Setup.sql
```

#### **2. Empty Tables**
```sql
-- Check if Entity Framework migrations ran
SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME LIKE 'AspNet%';

-- If tables exist but no data, run:
-- dotnet ef database update
-- dotnet run (to seed data)
```

#### **3. Missing Test Data**
```sql
-- Check if seed data was created
SELECT COUNT(*) FROM AspNetUsers WHERE Email LIKE '%@cafm.com';

-- If no test users, restart the backend application
-- The SeedData.Initialize method should create test accounts
```

---

## 📈 **Performance Testing**

### **Query Performance**
```sql
-- Enable execution time tracking
SET STATISTICS TIME ON;
SET STATISTICS IO ON;

-- Run your queries here

SET STATISTICS TIME OFF;
SET STATISTICS IO OFF;
```

### **Index Usage Analysis**
```sql
-- Check index usage on Tickets table
SELECT 
    i.name AS IndexName,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates
FROM sys.dm_db_index_usage_stats s
INNER JOIN sys.indexes i ON s.object_id = i.object_id AND s.index_id = i.index_id
WHERE OBJECT_NAME(s.object_id) = 'Tickets';
```

---

## 🎯 **Success Criteria**

### **✅ System is Working Correctly If:**
1. All core tables exist and contain data
2. Test users are present with correct roles
3. Tickets have valid relationships to users
4. No orphaned records exist
5. Status and priority values are within expected ranges
6. Comments are properly linked to tickets
7. Performance queries execute quickly (< 1 second)

### **❌ Issues to Investigate:**
1. Missing tables or empty result sets
2. Orphaned tickets without valid user references
3. Users without roles or multiple conflicting roles
4. Tickets with invalid status/priority values
5. Slow query performance (> 5 seconds)
6. Data integrity constraint violations

---

## 📞 **Support**

If you encounter issues:
1. **Check Backend Logs**: Look for Entity Framework errors
2. **Verify Connection String**: Ensure SSMS connects to correct database
3. **Run Migrations**: Execute `dotnet ef database update`
4. **Restart Backend**: Run `dotnet run` to trigger data seeding
5. **Check File Paths**: Ensure query files are in correct location

---

**🎉 Happy Testing! Your CAFM system database analysis starts here!**
