-- =============================================
-- CAFM System - Fresh Database Setup (Recreates Everything)
-- =============================================

-- Drop existing database if it exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CAFMSystem')
BEGIN
    ALTER DATABASE CAFMSystem SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CAFMSystem;
    PRINT 'Existing CAFMSystem database dropped.';
END
GO

-- Create fresh database
CREATE DATABASE CAFMSystem;
PRINT 'Fresh CAFMSystem database created.';
GO

USE CAFMSystem;
GO

-- Run Entity Framework migrations to create all tables
-- This will be done by the .NET application on startup

PRINT '==============================================';
PRINT 'Fresh Database Setup Complete!';
PRINT '==============================================';
PRINT 'Database: CAFMSystem (Fresh)';
PRINT '';
PRINT 'Next steps:';
PRINT '1. Run: dotnet run (this will create tables and seed data)';
PRINT '2. Tables and users will be created automatically';
PRINT '3. Use the reset passwords API if needed';
PRINT '==============================================';
GO
