-- Simple script to add Admin and End User
USE CAFMSystem;

-- Add Admin Role
IF NOT EXISTS (SELECT Id FROM AspNetRoles WHERE Name = 'Admin')
INSERT INTO AspNetRoles (Id, Name, NormalizedName) 
VALUES (NEWID(), 'Admin', 'ADMIN');

-- Add EndUser Role  
IF NOT EXISTS (SELECT Id FROM AspNetRoles WHERE Name = 'EndUser')
INSERT INTO AspNetRoles (Id, Name, NormalizedName) 
VALUES (NEWID(), 'EndUser', 'ENDUSER');

-- Add Admin User
DECLARE @AdminUserId NVARCHAR(450) = NEWID();
IF NOT EXISTS (SELECT Id FROM AspNetUsers WHERE Email = 'admin@cafm.com')
BEGIN
    INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FirstName, LastName, Department, EmployeeId, CreatedAt, IsActive)
    VALUES (@AdminUserId, 'admin@cafm.com', 'ADMIN@CAFM.COM', 'admin@cafm.com', 'ADMIN@CAFM.COM', 1, 'AQAAAAEAACcQAAAAEJ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q==', NEWID(), NEWID(), 0, 0, 1, 0, 'System', 'Administrator', 'IT', 'ADMIN001', GETDATE(), 1);
    
    -- Assign Admin role
    INSERT INTO AspNetUserRoles (UserId, RoleId)
    SELECT @AdminUserId, Id FROM AspNetRoles WHERE Name = 'Admin';
END

-- Add End User
DECLARE @EndUserId NVARCHAR(450) = NEWID();
IF NOT EXISTS (SELECT Id FROM AspNetUsers WHERE Email = 'user@cafm.com')
BEGIN
    INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FirstName, LastName, Department, EmployeeId, CreatedAt, IsActive)
    VALUES (@EndUserId, 'user@cafm.com', 'USER@CAFM.COM', 'user@cafm.com', 'USER@CAFM.COM', 1, 'AQAAAAEAACcQAAAAEJ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q==', NEWID(), NEWID(), 0, 0, 1, 0, 'Regular', 'User', 'General', 'USR001', GETDATE(), 1);
    
    -- Assign EndUser role
    INSERT INTO AspNetUserRoles (UserId, RoleId)
    SELECT @EndUserId, Id FROM AspNetRoles WHERE Name = 'EndUser';
END

-- Check results
SELECT 'Users created successfully!' as Status;
SELECT Email, FirstName, LastName, Department FROM AspNetUsers;
SELECT Name FROM AspNetRoles;
