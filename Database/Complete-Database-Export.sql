-- =============================================
-- CAFM System - Complete Database Export
-- Generated: June 2025
-- Description: Complete database schema and data export
-- Usage: Execute this script in SSMS to create the complete database
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CAFMSystem')
BEGIN
    CREATE DATABASE CAFMSystem;
    PRINT 'Database CAFMSystem created successfully.';
END
ELSE
BEGIN
    PRINT 'Database CAFMSystem already exists.';
END
GO

USE CAFMSystem;
GO

-- =============================================
-- Create Tables
-- =============================================

-- AspNetRoles Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetRoles' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
    
    CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
    PRINT 'AspNetRoles table created.';
END
GO

-- AspNetUsers Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUsers' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [FirstName] nvarchar(100) NOT NULL,
        [LastName] nvarchar(100) NOT NULL,
        [Department] nvarchar(100) NULL,
        [EmployeeId] nvarchar(50) NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [LastLoginAt] datetime2 NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
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
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
    
    CREATE INDEX [IX_AspNetUsers_Department] ON [AspNetUsers] ([Department]);
    CREATE INDEX [IX_AspNetUsers_EmployeeId] ON [AspNetUsers] ([EmployeeId]);
    CREATE INDEX [IX_AspNetUsers_IsActive] ON [AspNetUsers] ([IsActive]);
    CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
    PRINT 'AspNetUsers table created.';
END
GO

-- AspNetUserRoles Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserRoles' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
    PRINT 'AspNetUserRoles table created.';
END
GO

-- AspNetUserClaims Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserClaims' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetUserClaims] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
    PRINT 'AspNetUserClaims table created.';
END
GO

-- AspNetUserLogins Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserLogins' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
    PRINT 'AspNetUserLogins table created.';
END
GO

-- AspNetUserTokens Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetUserTokens' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    PRINT 'AspNetUserTokens table created.';
END
GO

-- AspNetRoleClaims Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='AspNetRoleClaims' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[AspNetRoleClaims] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
    PRINT 'AspNetRoleClaims table created.';
END
GO

-- Tickets Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tickets' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[Tickets] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(2000) NOT NULL,
        [Status] int NOT NULL DEFAULT 1,
        [Priority] int NOT NULL DEFAULT 2,
        [Category] int NOT NULL DEFAULT 5,
        [Type] int NOT NULL DEFAULT 2,
        [Location] nvarchar(200) NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [UpdatedAt] datetime2 NULL,
        [CompletedAt] datetime2 NULL,
        [DueDate] datetime2 NULL,
        [CreatedById] nvarchar(450) NOT NULL,
        [AssignedToId] nvarchar(450) NULL,
        CONSTRAINT [PK_Tickets] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Tickets_AspNetUsers_AssignedToId] FOREIGN KEY ([AssignedToId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Tickets_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE NO ACTION
    );
    
    CREATE INDEX [IX_Tickets_AssignedToId] ON [Tickets] ([AssignedToId]);
    CREATE INDEX [IX_Tickets_CreatedById] ON [Tickets] ([CreatedById]);
    CREATE INDEX [IX_Tickets_Status] ON [Tickets] ([Status]);
    CREATE INDEX [IX_Tickets_Priority] ON [Tickets] ([Priority]);
    CREATE INDEX [IX_Tickets_Category] ON [Tickets] ([Category]);
    CREATE INDEX [IX_Tickets_CreatedAt] ON [Tickets] ([CreatedAt]);
    PRINT 'Tickets table created.';
END
GO

-- TicketComments Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='TicketComments' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[TicketComments] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Comment] nvarchar(2000) NOT NULL,
        [CreatedAt] datetime2 NOT NULL DEFAULT (GETUTCDATE()),
        [TicketId] int NOT NULL,
        [CreatedById] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_TicketComments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_TicketComments_AspNetUsers_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_TicketComments_Tickets_TicketId] FOREIGN KEY ([TicketId]) REFERENCES [Tickets] ([Id]) ON DELETE CASCADE
    );
    
    CREATE INDEX [IX_TicketComments_CreatedById] ON [TicketComments] ([CreatedById]);
    CREATE INDEX [IX_TicketComments_TicketId] ON [TicketComments] ([TicketId]);
    PRINT 'TicketComments table created.';
END
GO

PRINT 'All tables created successfully.';
PRINT '==========================================';
PRINT 'Starting data insertion...';
PRINT '==========================================';
