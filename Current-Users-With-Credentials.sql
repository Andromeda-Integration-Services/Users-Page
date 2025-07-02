-- =============================================
-- CAFM System - Current Users with Login Credentials
-- =============================================
-- This query displays all current users in the system with their login information
-- Note: Passwords are hashed for security, but default passwords are documented below

SELECT 
    u.Id,
    u.UserName,
    u.Email,
    u.FirstName,
    u.LastName,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.Department,
    u.EmployeeId,
    u.IsActive,
    u.EmailConfirmed,
    u.CreatedAt,
    u.LastLoginAt,
    STRING_AGG(r.Name, ', ') AS Roles,
    -- Password is hashed, but default passwords are listed in comments below
    CASE 
        WHEN u.Email = 'admin@cafm.com' THEN 'Admin123!'
        WHEN u.Email = 'manager@cafm.com' THEN 'Manager123!'
        WHEN u.Email = 'plumber@cafm.com' THEN 'Plumber123!'
        WHEN u.Email = 'electrician@cafm.com' THEN 'Electric123!'
        WHEN u.Email = 'cleaner@cafm.com' THEN 'Cleaner123!'
        WHEN u.Email = 'user@cafm.com' THEN 'User123!'
        ELSE 'Contact Admin for Password'
    END AS DefaultPassword
FROM AspNetUsers u
LEFT JOIN AspNetUserRoles ur ON u.Id = ur.UserId
LEFT JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE u.IsActive = 1
GROUP BY 
    u.Id, u.UserName, u.Email, u.FirstName, u.LastName, 
    u.Department, u.EmployeeId, u.IsActive, u.EmailConfirmed, 
    u.CreatedAt, u.LastLoginAt
ORDER BY u.CreatedAt;

-- =============================================
-- SUMMARY OF DEFAULT USER ACCOUNTS
-- =============================================
/*
SEEDED USER ACCOUNTS WITH DEFAULT CREDENTIALS:

1. SYSTEM ADMINISTRATOR
   Email: admin@cafm.com
   Password: Admin123!
   Role: Admin
   Department: IT
   Employee ID: ADMIN001

2. ASSET MANAGER
   Email: manager@cafm.com
   Password: Manager123!
   Role: AssetManager
   Department: Facilities
   Employee ID: MGR001

3. PLUMBER
   Email: plumber@cafm.com
   Password: Plumber123!
   Role: Plumber
   Department: Maintenance
   Employee ID: PLB001

4. ELECTRICIAN
   Email: electrician@cafm.com
   Password: Electric123!
   Role: Electrician
   Department: Maintenance
   Employee ID: ELC001

5. CLEANER
   Email: cleaner@cafm.com
   Password: Cleaner123!
   Role: Cleaner
   Department: Cleaning
   Employee ID: CLN001

6. END USER
   Email: user@cafm.com
   Password: User123!
   Role: EndUser
   Department: General
   Employee ID: USR001

NOTES:
- All users have EmailConfirmed = true
- All users have IsActive = true
- Passwords follow the pattern: [Role]123!
- These are seeded automatically when the application starts
- To reset passwords, use the API endpoint: POST /api/databasesetup/reset-all-passwords
*/

-- =============================================
-- ADDITIONAL QUERIES FOR USER MANAGEMENT
-- =============================================

-- Count users by role
SELECT 
    r.Name AS RoleName,
    COUNT(ur.UserId) AS UserCount
FROM AspNetRoles r
LEFT JOIN AspNetUserRoles ur ON r.Id = ur.RoleId
LEFT JOIN AspNetUsers u ON ur.UserId = u.Id AND u.IsActive = 1
GROUP BY r.Name
ORDER BY UserCount DESC;

-- Recent login activity
SELECT 
    u.Email,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.LastLoginAt,
    CASE 
        WHEN u.LastLoginAt IS NULL THEN 'Never logged in'
        WHEN u.LastLoginAt > DATEADD(day, -1, GETUTCDATE()) THEN 'Active (last 24h)'
        WHEN u.LastLoginAt > DATEADD(day, -7, GETUTCDATE()) THEN 'Recent (last week)'
        WHEN u.LastLoginAt > DATEADD(day, -30, GETUTCDATE()) THEN 'Inactive (last month)'
        ELSE 'Long inactive (>30 days)'
    END AS LoginStatus
FROM AspNetUsers u
WHERE u.IsActive = 1
ORDER BY u.LastLoginAt DESC;

-- Users by department
SELECT 
    u.Department,
    COUNT(*) AS UserCount,
    STRING_AGG(u.FirstName + ' ' + u.LastName, ', ') AS Users
FROM AspNetUsers u
WHERE u.IsActive = 1
GROUP BY u.Department
ORDER BY UserCount DESC;
