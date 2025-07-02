-- =============================================
-- CAFM System Database Setup Script
-- =============================================

-- Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'CAFMSystem')
BEGIN
    CREATE DATABASE CAFMSystem;
    PRINT 'Database CAFMSystem created successfully!';
END
ELSE
BEGIN
    PRINT 'Database CAFMSystem already exists.';
END

-- Use the database
USE CAFMSystem;

-- Check if database is ready
SELECT
    'Database CAFMSystem is ready!' as Status,
    GETDATE() as CreatedAt;

-- Show database information
SELECT
    name as DatabaseName,
    database_id,
    create_date,
    collation_name
FROM sys.databases
WHERE name = 'CAFMSystem';

PRINT '============================================';
PRINT 'CAFM Database Setup Complete!';
PRINT '============================================';
PRINT 'Next Steps:';
PRINT '1. Run: dotnet ef database update';
PRINT '2. Start the backend: dotnet run';
PRINT '3. Test connection at: http://localhost:5000/swagger';
PRINT '============================================';
