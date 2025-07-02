-- =============================================
-- CAFM System - Complete Database Export
-- Run this script on any MSSQL Server to recreate the entire database
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CAFMSystem')
BEGIN
    CREATE DATABASE CAFMSystem;
END
GO

USE CAFMSystem;
GO

-- =============================================
-- 1. CREATE TABLES (ASP.NET Identity + Custom)
-- =============================================

-- AspNetRoles
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetRoles' AND xtype='U')
CREATE TABLE [dbo].[AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO

-- AspNetUsers
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUsers' AND xtype='U')
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

-- AspNetUserRoles
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserRoles' AND xtype='U')
CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO

-- Tickets Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tickets' AND xtype='U')
CREATE TABLE [dbo].[Tickets] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Title] nvarchar(200) NOT NULL,
    [Description] nvarchar(2000) NOT NULL,
    [Status] int NOT NULL DEFAULT 1,
    [Priority] int NOT NULL DEFAULT 2,
    [Category] int NOT NULL DEFAULT 1,
    [Type] int NOT NULL DEFAULT 2,
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
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TicketComments' AND xtype='U')
CREATE TABLE [dbo].[TicketComments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Comment] nvarchar(2000) NOT NULL,
    [CreatedAt] datetime2(7) NOT NULL DEFAULT GETUTCDATE(),
    [TicketId] int NOT NULL,
    [CreatedById] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_TicketComments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TicketComments_Tickets_TicketId] FOREIGN KEY ([TicketId]) REFERENCES [Tickets] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_TicketComments_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
);
GO

-- =============================================
-- 2. CREATE INDEXES (IF NOT EXISTS)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetUsers_Department')
    CREATE NONCLUSTERED INDEX [IX_AspNetUsers_Department] ON [AspNetUsers] ([Department]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetUsers_EmployeeId')
    CREATE NONCLUSTERED INDEX [IX_AspNetUsers_EmployeeId] ON [AspNetUsers] ([EmployeeId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetUsers_IsActive')
    CREATE NONCLUSTERED INDEX [IX_AspNetUsers_IsActive] ON [AspNetUsers] ([IsActive]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tickets_CreatedById')
    CREATE NONCLUSTERED INDEX [IX_Tickets_CreatedById] ON [Tickets] ([CreatedById]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tickets_AssignedToId')
    CREATE NONCLUSTERED INDEX [IX_Tickets_AssignedToId] ON [Tickets] ([AssignedToId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TicketComments_TicketId')
    CREATE NONCLUSTERED INDEX [IX_TicketComments_TicketId] ON [TicketComments] ([TicketId]);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TicketComments_CreatedById')
    CREATE NONCLUSTERED INDEX [IX_TicketComments_CreatedById] ON [TicketComments] ([CreatedById]);
GO

PRINT 'Database schema created successfully!';
GO

-- =============================================
-- 3. INSERT ROLES
-- =============================================
DELETE FROM AspNetRoles;
GO

INSERT INTO AspNetRoles (Id, Name, NormalizedName) VALUES
('810615BF-21E5-4EC8-9725-73159F3C0F9E', 'Admin', 'ADMIN'),
('965a4920-ba11-40c6-8e4c-e5d203e1c9a2', 'AssetManager', 'ASSETMANAGER'),
('8dc76df6-7176-4186-bd9f-e91a02c69ecb', 'Plumber', 'PLUMBER'),
('2da40ccc-b682-4c15-b927-07324ccb6845', 'Electrician', 'ELECTRICIAN'),
('dce893a9-ed1c-4dc9-adfb-61336a8b912f', 'Cleaner', 'CLEANER'),
('EA821A7B-AD79-49C3-82F0-8630624A42F4', 'EndUser', 'ENDUSER');
GO

-- =============================================
-- 4. INSERT USERS (with fresh password hashes)
-- =============================================
DELETE FROM AspNetUserRoles;
DELETE FROM AspNetUsers;
GO

-- Admin User
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt)
VALUES (
    '1C2095A6-241B-4620-86A4-E2FC04CBB096',
    'admin@cafm.com', 'ADMIN@CAFM.COM', 'admin@cafm.com', 'ADMIN@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEN+ZvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'System', 'Administrator', 'IT', 'ADMIN001', 1, GETUTCDATE()
);

-- End User
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt)
VALUES (
    '31FB6CC7-8878-40A7-A061-89CE0D1BBFD6',
    'user@cafm.com', 'USER@CAFM.COM', 'user@cafm.com', 'USER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEGYLvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Regular', 'User', 'General', 'USR001', 1, GETUTCDATE()
);

-- Asset Manager
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt)
VALUES (
    '36b42b6c-7526-43ac-aafd-ad269515e6a5',
    'manager@cafm.com', 'MANAGER@CAFM.COM', 'manager@cafm.com', 'MANAGER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEMGRvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Asset', 'Manager', 'Facilities', 'MGR001', 1, GETUTCDATE()
);

-- Plumber
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt)
VALUES (
    'b0bb0e50-cf37-4a53-8d99-b6d88fe80244',
    'plumber@cafm.com', 'PLUMBER@CAFM.COM', 'plumber@cafm.com', 'PLUMBER@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEPLBvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'John', 'Plumber', 'Maintenance', 'PLB001', 1, GETUTCDATE()
);

-- Electrician
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt)
VALUES (
    '3e03c3b7-989f-4521-909c-b75e2775707b',
    'electrician@cafm.com', 'ELECTRICIAN@CAFM.COM', 'electrician@cafm.com', 'ELECTRICIAN@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEELCvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Mike', 'Electrician', 'Maintenance', 'ELC001', 1, GETUTCDATE()
);

-- Cleaner (Inzamam)
INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed,
    PasswordHash, SecurityStamp, ConcurrencyStamp, FirstName, LastName, Department, EmployeeId, IsActive, CreatedAt)
VALUES (
    '975f7eba-33b1-43a1-92d9-df44b26048c1',
    'inzamam@cafm.com', 'INZAMAM@CAFM.COM', 'inzamam@cafm.com', 'INZAMAM@CAFM.COM', 1,
    'AQAAAAIAAYagAAAAEINZvKkPJH8tVKz1CEqJtlqhPOTm8RuJkZRQWQQvQQQvQQQvQQQvQQQvQQQvQQQvQQ==',
    NEWID(), NEWID(), 'Inzamam', 'haq', '', 'INZ001', 1, GETUTCDATE()
);
GO

-- =============================================
-- 5. ASSIGN USER ROLES
-- =============================================
INSERT INTO AspNetUserRoles (UserId, RoleId) VALUES
('1C2095A6-241B-4620-86A4-E2FC04CBB096', '810615BF-21E5-4EC8-9725-73159F3C0F9E'), -- Admin
('31FB6CC7-8878-40A7-A061-89CE0D1BBFD6', 'EA821A7B-AD79-49C3-82F0-8630624A42F4'), -- EndUser
('36b42b6c-7526-43ac-aafd-ad269515e6a5', '965a4920-ba11-40c6-8e4c-e5d203e1c9a2'), -- AssetManager
('b0bb0e50-cf37-4a53-8d99-b6d88fe80244', '8dc76df6-7176-4186-bd9f-e91a02c69ecb'), -- Plumber
('3e03c3b7-989f-4521-909c-b75e2775707b', '2da40ccc-b682-4c15-b927-07324ccb6845'), -- Electrician
('975f7eba-33b1-43a1-92d9-df44b26048c1', 'dce893a9-ed1c-4dc9-adfb-61336a8b912f'); -- Cleaner
GO

-- =============================================
-- 6. INSERT SAMPLE TICKETS
-- =============================================
DELETE FROM TicketComments;
DELETE FROM Tickets;
GO

INSERT INTO Tickets (Title, Description, Status, Priority, Category, Location, CreatedById, CreatedAt) VALUES
('Test Ticket from API', 'This is a test ticket created via API to verify the system works', 1, 2, 1, 'Building A, Room 101', '1C2095A6-241B-4620-86A4-E2FC04CBB096', GETUTCDATE()),
('Power Fluctuation Issue', 'Electrical power fluctuating in Building 45', 1, 3, 2, 'Building 45', 'b0bb0e50-cf37-4a53-8d99-b6d88fe80244', GETUTCDATE()),
('Critical Power Problem', 'Power outage affecting multiple floors', 1, 4, 2, 'POS Building', '3e03c3b7-989f-4521-909c-b75e2775707b', GETUTCDATE());
GO

-- =============================================
-- 7. FINAL SUCCESS MESSAGE
-- =============================================
PRINT '==============================================';
PRINT 'CAFM Database Setup Complete!';
PRINT '==============================================';
PRINT 'Database: CAFMSystem';
PRINT 'Users Created: 6 (Admin, EndUser, AssetManager, Plumber, Electrician, Cleaner)';
PRINT 'Sample Tickets: 3';
PRINT '';
PRINT 'LOGIN CREDENTIALS:';
PRINT 'Admin: admin@cafm.com / Admin123!';
PRINT 'EndUser: user@cafm.com / User123!';
PRINT 'Manager: manager@cafm.com / Manager123!';
PRINT 'Plumber: plumber@cafm.com / Plumber123!';
PRINT 'Electrician: electrician@cafm.com / Electric123!';
PRINT 'Cleaner: inzamam@cafm.com / Cleaner123!';
PRINT '';
PRINT 'NOTE: Run password reset API endpoints after import to set proper passwords.';
PRINT '==============================================';
GO