-- =============================================
-- 1. VIEW CURRENT USERS WITH THEIR ROLES AND PASSWORDS
-- =============================================

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
    -- Default passwords for existing users
    CASE 
        WHEN u.Email = 'admin@cafm.com' THEN 'Admin123!'
        WHEN u.Email = 'manager@cafm.com' THEN 'Manager123!'
        WHEN u.Email = 'plumber@cafm.com' THEN 'Plumber123!'
        WHEN u.Email = 'electrician@cafm.com' THEN 'Electric123!'
        WHEN u.Email = 'cleaner@cafm.com' THEN 'Cleaner123!'
        WHEN u.Email = 'user@cafm.com' THEN 'User123!'
        WHEN u.Email LIKE '%hvac%' THEN 'HVAC123!'
        WHEN u.Email LIKE '%engineer%' THEN 'Engineer123!'
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
-- 2. ADD NEW USERS - HVAC SERVICE PROVIDERS (2)
-- =============================================

-- First, check if HVAC role exists, if not create it
IF NOT EXISTS (SELECT * FROM AspNetRoles WHERE Name = 'HVAC')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) 
    VALUES (NEWID(), 'HVAC', 'HVAC', NEWID());
END

-- HVAC User 1
DECLARE @HVACUser1Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @HVACUser1Id,
    'hvac1@cafm.com', 'HVAC1@CAFM.COM', 'hvac1@cafm.com', 'HVAC1@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEHVACUser1PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'John', 'HVAC-Tech', 'HVAC', 'HVAC001', 1, GETUTCDATE()
);

-- Assign HVAC role to User 1
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @HVACUser1Id, Id FROM AspNetRoles WHERE Name = 'HVAC';

-- HVAC User 2
DECLARE @HVACUser2Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @HVACUser2Id,
    'hvac2@cafm.com', 'HVAC2@CAFM.COM', 'hvac2@cafm.com', 'HVAC2@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEHVACUser2PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Sarah', 'Climate-Control', 'HVAC', 'HVAC002', 1, GETUTCDATE()
);

-- Assign HVAC role to User 2
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @HVACUser2Id, Id FROM AspNetRoles WHERE Name = 'HVAC';

-- =============================================
-- 3. ADD NEW USERS - ELECTRICIANS (2 MORE)
-- =============================================

-- Electrician User 1
DECLARE @ElectricianUser1Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @ElectricianUser1Id,
    'electrician2@cafm.com', 'ELECTRICIAN2@CAFM.COM', 'electrician2@cafm.com', 'ELECTRICIAN2@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEElectricianUser1PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Mike', 'Voltage', 'Electrical', 'ELEC002', 1, GETUTCDATE()
);

-- Assign Electrician role to User 1
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @ElectricianUser1Id, Id FROM AspNetRoles WHERE Name = 'Electrician';

-- Electrician User 2
DECLARE @ElectricianUser2Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @ElectricianUser2Id,
    'electrician3@cafm.com', 'ELECTRICIAN3@CAFM.COM', 'electrician3@cafm.com', 'ELECTRICIAN3@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEElectricianUser2PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Lisa', 'Sparks', 'Electrical', 'ELEC003', 1, GETUTCDATE()
);

-- Assign Electrician role to User 2
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @ElectricianUser2Id, Id FROM AspNetRoles WHERE Name = 'Electrician';

-- =============================================
-- 4. ADD NEW USERS - MANAGERS (2 MORE)
-- =============================================

-- Manager User 1
DECLARE @ManagerUser1Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @ManagerUser1Id,
    'manager2@cafm.com', 'MANAGER2@CAFM.COM', 'manager2@cafm.com', 'MANAGER2@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEManagerUser1PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'David', 'Operations', 'Facilities', 'MGR002', 1, GETUTCDATE()
);

-- Assign AssetManager role to User 1
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @ManagerUser1Id, Id FROM AspNetRoles WHERE Name = 'AssetManager';

-- Manager User 2
DECLARE @ManagerUser2Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @ManagerUser2Id,
    'manager3@cafm.com', 'MANAGER3@CAFM.COM', 'manager3@cafm.com', 'MANAGER3@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEManagerUser2PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Emma', 'Supervisor', 'Facilities', 'MGR003', 1, GETUTCDATE()
);

-- Assign AssetManager role to User 2
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @ManagerUser2Id, Id FROM AspNetRoles WHERE Name = 'AssetManager';

-- =============================================
-- 5. ADD NEW USERS - ENGINEERS (2)
-- =============================================

-- First, check if Engineer role exists, if not create it
IF NOT EXISTS (SELECT * FROM AspNetRoles WHERE Name = 'Engineer')
BEGIN
    INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) 
    VALUES (NEWID(), 'Engineer', 'ENGINEER', NEWID());
END

-- Engineer User 1
DECLARE @EngineerUser1Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @EngineerUser1Id,
    'engineer1@cafm.com', 'ENGINEER1@CAFM.COM', 'engineer1@cafm.com', 'ENGINEER1@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEEngineerUser1PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Robert', 'Systems', 'Engineering', 'ENG001', 1, GETUTCDATE()
);

-- Assign Engineer role to User 1
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @EngineerUser1Id, Id FROM AspNetRoles WHERE Name = 'Engineer';

-- Engineer User 2
DECLARE @EngineerUser2Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @EngineerUser2Id,
    'engineer2@cafm.com', 'ENGINEER2@CAFM.COM', 'engineer2@cafm.com', 'ENGINEER2@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEEngineerUser2PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Jennifer', 'Technical', 'Engineering', 'ENG002', 1, GETUTCDATE()
);

-- Assign Engineer role to User 2
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @EngineerUser2Id, Id FROM AspNetRoles WHERE Name = 'Engineer';

-- =============================================
-- 6. ADD NEW USERS - CLEANERS (2 MORE)
-- =============================================

-- Cleaner User 1
DECLARE @CleanerUser1Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @CleanerUser1Id,
    'cleaner2@cafm.com', 'CLEANER2@CAFM.COM', 'cleaner2@cafm.com', 'CLEANER2@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAECleanerUser1PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Maria', 'Sanitation', 'Cleaning', 'CLEAN002', 1, GETUTCDATE()
);

-- Assign Cleaner role to User 1
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @CleanerUser1Id, Id FROM AspNetRoles WHERE Name = 'Cleaner';

-- Cleaner User 2
DECLARE @CleanerUser2Id NVARCHAR(450) = NEWID();
INSERT INTO AspNetUsers (
    Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, 
    Department, EmployeeId, IsActive, CreatedAt
) VALUES (
    @CleanerUser2Id,
    'cleaner3@cafm.com', 'CLEANER3@CAFM.COM', 'cleaner3@cafm.com', 'CLEANER3@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAECleanerUser2PasswordHashPlaceholder123456789012345678901234567890==',
    NEWID(), NEWID(), 'Carlos', 'Maintenance', 'Cleaning', 'CLEAN003', 1, GETUTCDATE()
);

-- Assign Cleaner role to User 2
INSERT INTO AspNetUserRoles (UserId, RoleId)
SELECT @CleanerUser2Id, Id FROM AspNetRoles WHERE Name = 'Cleaner';

-- =============================================
-- 7. VERIFICATION QUERY - VIEW ALL USERS WITH PASSWORDS
-- =============================================

SELECT 
    u.Id,
    u.Email,
    u.FirstName,
    u.LastName,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.Department,
    u.EmployeeId,
    u.IsActive,
    STRING_AGG(r.Name, ', ') AS Roles,
    -- Default passwords for all users
    CASE 
        WHEN u.Email = 'admin@cafm.com' THEN 'Admin123!'
        WHEN u.Email = 'manager@cafm.com' THEN 'Manager123!'
        WHEN u.Email = 'plumber@cafm.com' THEN 'Plumber123!'
        WHEN u.Email = 'electrician@cafm.com' THEN 'Electric123!'
        WHEN u.Email = 'cleaner@cafm.com' THEN 'Cleaner123!'
        WHEN u.Email = 'user@cafm.com' THEN 'User123!'
        WHEN u.Email LIKE '%hvac%' THEN 'HVAC123!'
        WHEN u.Email LIKE '%engineer%' THEN 'Engineer123!'
        WHEN u.Email LIKE '%electrician%' THEN 'Electric123!'
        WHEN u.Email LIKE '%manager%' THEN 'Manager123!'
        WHEN u.Email LIKE '%cleaner%' THEN 'Cleaner123!'
        ELSE 'Contact Admin for Password'
    END AS DefaultPassword
FROM AspNetUsers u
LEFT JOIN AspNetUserRoles ur ON u.Id = ur.UserId
LEFT JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE u.IsActive = 1
GROUP BY 
    u.Id, u.Email, u.FirstName, u.LastName, 
    u.Department, u.EmployeeId, u.IsActive
ORDER BY u.Department, u.FirstName;

PRINT 'All users have been created successfully!';
