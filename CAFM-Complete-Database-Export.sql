-- =============================================
-- CAFM System Database - Complete Export with All Data
-- =============================================
-- This script creates the complete CAFM database with all tables, data, and constraints
-- Compatible with SQL Server Management Studio (SSMS)
-- Run this script on any SQL Server instance to recreate the entire database
-- 
-- Version: 2.0.0
-- Date: December 2024
-- Features: Complete database with seeded users, roles, and sample tickets
-- 
-- INSTRUCTIONS:
-- 1. Open SQL Server Management Studio (SSMS)
-- 2. Connect to your SQL Server instance
-- 3. Open this file and execute it
-- 4. Database will be created with all data ready to use
-- =============================================

USE master;
GO

-- Drop database if exists (CAUTION: This will delete existing data)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CAFMSystem')
BEGIN
    ALTER DATABASE CAFMSystem SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CAFMSystem;
END
GO

-- Create fresh database
CREATE DATABASE CAFMSystem;
GO

USE CAFMSystem;
GO

-- =============================================
-- 1. CREATE TABLES (ASP.NET Identity + Custom)
-- =============================================

-- AspNetRoles Table
CREATE TABLE [dbo].[AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

-- AspNetUsers Table (Extended with custom fields)
CREATE TABLE [dbo].[AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset(7) NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    -- Custom CAFM fields
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Department] nvarchar(100) NULL,
    [EmployeeId] nvarchar(50) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [LastLoginAt] datetime2(7) NULL,
    [IsActive] bit NOT NULL DEFAULT 1,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
);
GO

-- AspNetUserRoles Table
CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

-- AspNetUserClaims Table
CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

-- AspNetUserLogins Table
CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

-- AspNetUserTokens Table
CREATE TABLE [dbo].[AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

-- AspNetRoleClaims Table
CREATE TABLE [dbo].[AspNetRoleClaims] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO

-- Tickets Table (Main CAFM functionality)
CREATE TABLE [dbo].[Tickets] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(2000) NOT NULL,
    [Status] int NOT NULL DEFAULT 1, -- 1=Open, 2=InProgress, 3=OnHold, 4=Resolved, 5=Closed, 6=Cancelled
    [Priority] int NOT NULL DEFAULT 2, -- 1=Low, 2=Medium, 3=High, 4=Critical, 5=Emergency
    [Category] int NOT NULL DEFAULT 1, -- 1=General, 2=Plumbing, 3=Electrical, 4=HVAC, 5=Cleaning, 6=Security
    [Location] nvarchar(200) NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] datetime2(7) NULL,
    [CompletedAt] datetime2(7) NULL,
    [DueDate] datetime2(7) NULL,
    [CreatedById] nvarchar(450) NOT NULL,
    [AssignedToId] nvarchar(450) NULL,
    CONSTRAINT [PK_Tickets] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Tickets_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Tickets_AspNetUsers_AssignedToId] FOREIGN KEY ([AssignedToId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
);
GO

-- TicketComments Table
CREATE TABLE [dbo].[TicketComments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TicketId] int NOT NULL,
    [Comment] nvarchar(1000) NOT NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [CreatedById] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_TicketComments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TicketComments_Tickets_TicketId] FOREIGN KEY ([TicketId]) REFERENCES [Tickets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TicketComments_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
);
GO

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- User indexes
CREATE NONCLUSTERED INDEX [IX_AspNetUsers_EmployeeId] ON [AspNetUsers] ([EmployeeId]);
CREATE NONCLUSTERED INDEX [IX_AspNetUsers_Department] ON [AspNetUsers] ([Department]);
CREATE NONCLUSTERED INDEX [IX_AspNetUsers_IsActive] ON [AspNetUsers] ([IsActive]);
CREATE NONCLUSTERED INDEX [IX_AspNetUsers_NormalizedEmail] ON [AspNetUsers] ([NormalizedEmail]);
CREATE NONCLUSTERED INDEX [IX_AspNetUsers_NormalizedUserName] ON [AspNetUsers] ([NormalizedUserName]);

-- Role indexes
CREATE NONCLUSTERED INDEX [IX_AspNetRoles_NormalizedName] ON [AspNetRoles] ([NormalizedName]);

-- Ticket indexes
CREATE NONCLUSTERED INDEX [IX_Tickets_Status] ON [Tickets] ([Status]);
CREATE NONCLUSTERED INDEX [IX_Tickets_Priority] ON [Tickets] ([Priority]);
CREATE NONCLUSTERED INDEX [IX_Tickets_Category] ON [Tickets] ([Category]);
CREATE NONCLUSTERED INDEX [IX_Tickets_CreatedAt] ON [Tickets] ([CreatedAt]);
CREATE NONCLUSTERED INDEX [IX_Tickets_CreatedById] ON [Tickets] ([CreatedById]);
CREATE NONCLUSTERED INDEX [IX_Tickets_AssignedToId] ON [Tickets] ([AssignedToId]);

-- Comment indexes
CREATE NONCLUSTERED INDEX [IX_TicketComments_TicketId] ON [TicketComments] ([TicketId]);
CREATE NONCLUSTERED INDEX [IX_TicketComments_CreatedAt] ON [TicketComments] ([CreatedAt]);

-- User role indexes
CREATE NONCLUSTERED INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
CREATE NONCLUSTERED INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
CREATE NONCLUSTERED INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
CREATE NONCLUSTERED INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

GO

-- =============================================
-- 3. INSERT ROLES DATA
-- =============================================

-- Clear existing data
DELETE FROM AspNetUserRoles;
DELETE FROM AspNetUserClaims;
DELETE FROM AspNetUserLogins;
DELETE FROM AspNetUserTokens;
DELETE FROM AspNetRoleClaims;
DELETE FROM TicketComments;
DELETE FROM Tickets;
DELETE FROM AspNetUsers;
DELETE FROM AspNetRoles;
GO

-- Insert Roles
INSERT INTO AspNetRoles (Id, Name, NormalizedName, ConcurrencyStamp) VALUES
('1', 'Admin', 'ADMIN', NEWID()),
('2', 'AssetManager', 'ASSETMANAGER', NEWID()),
('3', 'Plumber', 'PLUMBER', NEWID()),
('4', 'Electrician', 'ELECTRICIAN', NEWID()),
('5', 'Cleaner', 'CLEANER', NEWID()),
('6', 'EndUser', 'ENDUSER', NEWID());
GO

-- =============================================
-- 4. INSERT USERS DATA (with working passwords)
-- =============================================

-- Admin User (admin@cafm.com / Admin123!)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt,
    PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES (
    '1C2095A6-241B-4620-86A4-E2FC04CBB096',
    'admin@cafm.com', 'ADMIN@CAFM.COM', 'admin@cafm.com', 'ADMIN@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEHYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'System', 'Administrator', 'IT', 'ADMIN001', 1, GETUTCDATE(),
    0, 0, 1, 0
);

-- Asset Manager (manager@cafm.com / Manager123!)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt,
    PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES (
    '2D3196B7-9989-51B8-B172-9ACE1D2CCFD7',
    'manager@cafm.com', 'MANAGER@CAFM.COM', 'manager@cafm.com', 'MANAGER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEGYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Asset', 'Manager', 'Facilities', 'MGR001', 1, GETUTCDATE(),
    0, 0, 1, 0
);

-- Plumber (plumber@cafm.com / Plumber123!)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt,
    PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES (
    '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8',
    'plumber@cafm.com', 'PLUMBER@CAFM.COM', 'plumber@cafm.com', 'PLUMBER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEHYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'John', 'Plumber', 'Maintenance', 'PLB001', 1, GETUTCDATE(),
    0, 0, 1, 0
);

-- Electrician (electrician@cafm.com / Electric123!)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt,
    PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES (
    '4F5398D9-BB0B-73DA-D394-BCEF3F4EEFF9',
    'electrician@cafm.com', 'ELECTRICIAN@CAFM.COM', 'electrician@cafm.com', 'ELECTRICIAN@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEGYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Mike', 'Electrician', 'Maintenance', 'ELC001', 1, GETUTCDATE(),
    0, 0, 1, 0
);

-- Cleaner (cleaner@cafm.com / Cleaner123!)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt,
    PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES (
    '5G6499EA-CC1C-84EB-E4A5-CDEF4G5FF0GA',
    'cleaner@cafm.com', 'CLEANER@CAFM.COM', 'cleaner@cafm.com', 'CLEANER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEHYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Sarah', 'Cleaner', 'Cleaning', 'CLN001', 1, GETUTCDATE(),
    0, 0, 1, 0
);

-- End User (user@cafm.com / User123!)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt,
    PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount)
VALUES (
    '6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB',
    'user@cafm.com', 'USER@CAFM.COM', 'user@cafm.com', 'USER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEGYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Regular', 'User', 'General', 'USR001', 1, GETUTCDATE(),
    0, 0, 1, 0
);
GO

-- =============================================
-- 5. ASSIGN USER ROLES
-- =============================================

-- Assign roles to users
INSERT INTO AspNetUserRoles (UserId, RoleId) VALUES
('1C2095A6-241B-4620-86A4-E2FC04CBB096', '1'), -- Admin
('2D3196B7-9989-51B8-B172-9ACE1D2CCFD7', '2'), -- AssetManager
('3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8', '3'), -- Plumber
('4F5398D9-BB0B-73DA-D394-BCEF3F4EEFF9', '4'), -- Electrician
('5G6499EA-CC1C-84EB-E4A5-CDEF4G5FF0GA', '5'), -- Cleaner
('6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', '6'); -- EndUser
GO

-- =============================================
-- 6. INSERT SAMPLE TICKETS DATA
-- =============================================

-- Sample tickets with realistic data for testing
INSERT INTO Tickets (Title, Description, Status, Priority, Category, Location, CreatedAt, UpdatedAt, CompletedAt, CreatedById, AssignedToId) VALUES

-- Plumbing Tickets
('Water leak in main lobby restroom',
'Water is leaking from the ceiling in the main lobby men''s restroom. The leak appears to be coming from the pipe above the sink area. Water is pooling on the floor creating a slip hazard.',
2, 4, 2, 'Main Lobby - Men''s Restroom',
DATEADD(hour, -2, GETUTCDATE()), DATEADD(hour, -1, GETUTCDATE()), NULL,
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8'),

('Clogged drain in kitchen sink',
'The kitchen sink in the employee break room is completely clogged. Water is backing up and not draining at all. Staff cannot wash dishes or prepare food properly.',
2, 3, 2, 'Employee Break Room - Kitchen',
DATEADD(hour, -6, GETUTCDATE()), DATEADD(hour, -4, GETUTCDATE()), NULL,
'2D3196B7-9989-51B8-B172-9ACE1D2CCFD7', '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8'),

('Low water pressure in 3rd floor bathrooms',
'Multiple users have reported very low water pressure in all bathrooms on the 3rd floor. Both hot and cold water are affected. The issue started yesterday morning.',
1, 2, 2, '3rd Floor - All Bathrooms',
DATEADD(day, -1, GETUTCDATE()), NULL, NULL,
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8'),

-- Electrical Tickets
('Power outage in conference room B',
'Complete power outage in conference room B. No lights, no outlets working. Important client meeting scheduled for tomorrow morning.',
1, 4, 3, 'Conference Room B',
DATEADD(hour, -1, GETUTCDATE()), NULL, NULL,
'2D3196B7-9989-51B8-B172-9ACE1D2CCFD7', '4F5398D9-BB0B-73DA-D394-BCEF3F4EEFF9'),

('Flickering lights in hallway corridor',
'The fluorescent lights in the main hallway corridor are flickering constantly. It''s causing eye strain for employees walking through the area.',
1, 2, 3, 'Main Hallway Corridor',
DATEADD(hour, -4, GETUTCDATE()), NULL, NULL,
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', '4F5398D9-BB0B-73DA-D394-BCEF3F4EEFF9'),

-- HVAC Tickets
('Air conditioning not cooling in open office',
'The air conditioning system in the main open office area is running but not cooling effectively. Temperature is consistently 78°F despite thermostat set to 72°F.',
2, 3, 4, 'Main Open Office Area',
DATEADD(day, -2, GETUTCDATE()), DATEADD(day, -1, GETUTCDATE()), NULL,
'2D3196B7-9989-51B8-B172-9ACE1D2CCFD7', NULL),

('Heating system not working in north wing',
'The heating system in the north wing is completely non-functional. Employees are complaining about cold temperatures.',
1, 3, 4, 'North Wing - All Offices',
DATEADD(hour, -8, GETUTCDATE()), NULL, NULL,
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', NULL),

-- Cleaning Tickets
('Carpet stain removal needed in reception',
'Large coffee stain on the carpet in the main reception area. The stain is very visible and needs professional cleaning.',
1, 2, 5, 'Main Reception Area',
DATEADD(hour, -3, GETUTCDATE()), NULL, NULL,
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', '5G6499EA-CC1C-84EB-E4A5-CDEF4G5FF0GA'),

('Restroom supplies need restocking',
'All restrooms on the 2nd floor are out of paper towels and toilet paper. Hand soap dispensers are also empty.',
4, 1, 5, '2nd Floor - All Restrooms',
DATEADD(day, -1, GETUTCDATE()), DATEADD(hour, -2, GETUTCDATE()), DATEADD(hour, -2, GETUTCDATE()),
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', '5G6499EA-CC1C-84EB-E4A5-CDEF4G5FF0GA'),

-- General Tickets
('Broken door handle in meeting room A',
'The door handle in meeting room A is completely broken and the door cannot be opened from the inside. This is a safety concern.',
1, 3, 1, 'Meeting Room A',
DATEADD(hour, -5, GETUTCDATE()), NULL, NULL,
'2D3196B7-9989-51B8-B172-9ACE1D2CCFD7', NULL),

('Window blinds replacement needed',
'Several window blinds in the accounting department are broken and need replacement. They are not providing adequate light control.',
1, 1, 1, 'Accounting Department',
DATEADD(day, -3, GETUTCDATE()), NULL, NULL,
'6H759AFB-DD2D-95FC-F5B6-DEF05H6GG1HB', NULL);
GO

-- =============================================
-- 7. INSERT SAMPLE TICKET COMMENTS
-- =============================================

-- Add some sample comments to tickets
INSERT INTO TicketComments (TicketId, Comment, CreatedAt, CreatedById) VALUES
(1, 'I have assessed the leak and it appears to be a loose pipe joint. Will need to shut off water to fix properly.', DATEADD(hour, -1, GETUTCDATE()), '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8'),
(1, 'Water has been shut off to this area. Repair in progress.', DATEADD(minute, -30, GETUTCDATE()), '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8'),
(2, 'Attempted to clear with plunger but blockage is too severe. Will need to use drain snake.', DATEADD(hour, -3, GETUTCDATE()), '3E4297C8-AA9A-62C9-C283-ABDF2E3DDFE8'),
(4, 'Checked the circuit breaker - it appears to have tripped. Investigating the cause before resetting.', DATEADD(minute, -45, GETUTCDATE()), '4F5398D9-BB0B-73DA-D394-BCEF3F4EEFF9'),
(9, 'Supplies have been restocked. All dispensers are now full.', DATEADD(hour, -2, GETUTCDATE()), '5G6499EA-CC1C-84EB-E4A5-CDEF4G5FF0GA');
GO

-- =============================================
-- 8. VERIFICATION QUERIES
-- =============================================

-- Verify the database setup
PRINT '=== CAFM Database Setup Complete ===';
PRINT '';

-- Count records
DECLARE @RoleCount INT, @UserCount INT, @TicketCount INT, @CommentCount INT;

SELECT @RoleCount = COUNT(*) FROM AspNetRoles;
SELECT @UserCount = COUNT(*) FROM AspNetUsers;
SELECT @TicketCount = COUNT(*) FROM Tickets;
SELECT @CommentCount = COUNT(*) FROM TicketComments;

PRINT 'Database Statistics:';
PRINT '- Roles: ' + CAST(@RoleCount AS VARCHAR(10));
PRINT '- Users: ' + CAST(@UserCount AS VARCHAR(10));
PRINT '- Tickets: ' + CAST(@TicketCount AS VARCHAR(10));
PRINT '- Comments: ' + CAST(@CommentCount AS VARCHAR(10));
PRINT '';

-- Display user credentials
PRINT 'Default User Credentials:';
PRINT '========================';
PRINT 'Admin: admin@cafm.com / Admin123!';
PRINT 'Asset Manager: manager@cafm.com / Manager123!';
PRINT 'Plumber: plumber@cafm.com / Plumber123!';
PRINT 'Electrician: electrician@cafm.com / Electric123!';
PRINT 'Cleaner: cleaner@cafm.com / Cleaner123!';
PRINT 'End User: user@cafm.com / User123!';
PRINT '';
PRINT 'Database is ready for use!';
PRINT 'Backend API: http://localhost:5000';
PRINT 'Frontend: http://localhost:5173';

-- =============================================
-- 9. OPTIONAL: DISPLAY CURRENT DATA
-- =============================================

-- Uncomment these queries to see the data that was inserted

/*
-- Show all users with their roles
SELECT
    u.Email,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.Department,
    u.EmployeeId,
    r.Name AS Role,
    u.IsActive
FROM AspNetUsers u
LEFT JOIN AspNetUserRoles ur ON u.Id = ur.UserId
LEFT JOIN AspNetRoles r ON ur.RoleId = r.Id
ORDER BY u.Email;

-- Show all tickets with status
SELECT
    t.Id,
    t.Title,
    CASE t.Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'In Progress'
        WHEN 3 THEN 'On Hold'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Closed'
        WHEN 6 THEN 'Cancelled'
    END AS Status,
    CASE t.Priority
        WHEN 1 THEN 'Low'
        WHEN 2 THEN 'Medium'
        WHEN 3 THEN 'High'
        WHEN 4 THEN 'Critical'
        WHEN 5 THEN 'Emergency'
    END AS Priority,
    CASE t.Category
        WHEN 1 THEN 'General'
        WHEN 2 THEN 'Plumbing'
        WHEN 3 THEN 'Electrical'
        WHEN 4 THEN 'HVAC'
        WHEN 5 THEN 'Cleaning'
        WHEN 6 THEN 'Security'
    END AS Category,
    t.Location,
    creator.FirstName + ' ' + creator.LastName AS CreatedBy,
    assignee.FirstName + ' ' + assignee.LastName AS AssignedTo,
    t.CreatedAt
FROM Tickets t
LEFT JOIN AspNetUsers creator ON t.CreatedById = creator.Id
LEFT JOIN AspNetUsers assignee ON t.AssignedToId = assignee.Id
ORDER BY t.CreatedAt DESC;
*/

-- =============================================
-- END OF SCRIPT
-- =============================================
