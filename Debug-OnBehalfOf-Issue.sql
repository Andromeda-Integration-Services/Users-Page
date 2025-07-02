-- =============================================
-- Debug OnBehalfOf Issue - Diagnostic Script
-- Run this in SSMS to check the current state
-- =============================================

USE CAFMSystem;
GO

PRINT '=== DEBUGGING "ON BEHALF OF" ISSUE ===';
PRINT 'Checking current database state...';
PRINT '';

-- 1. Check if OnBehalfOf column exists
PRINT '1. Checking if OnBehalfOf column exists:';
IF EXISTS (
    SELECT 1 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'Tickets' 
    AND COLUMN_NAME = 'OnBehalfOf'
)
BEGIN
    PRINT '✅ OnBehalfOf column EXISTS in Tickets table';
END
ELSE
BEGIN
    PRINT '❌ OnBehalfOf column MISSING from Tickets table';
    PRINT '   → You need to run: ALTER TABLE Tickets ADD OnBehalfOf NVARCHAR(200) NULL;';
END

PRINT '';

-- 2. Show current table structure
PRINT '2. Current Tickets table structure:';
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Tickets'
ORDER BY ORDINAL_POSITION;

PRINT '';

-- 3. Check recent tickets and their OnBehalfOf values
PRINT '3. Recent tickets and OnBehalfOf values:';
SELECT TOP 10
    Id,
    Title,
    OnBehalfOf,
    CASE 
        WHEN OnBehalfOf IS NULL THEN 'NULL (will show Direct Request)'
        WHEN OnBehalfOf = '' THEN 'EMPTY (will show Direct Request)'
        ELSE 'HAS VALUE: ' + OnBehalfOf
    END AS OnBehalfOfStatus,
    CreatedAt
FROM Tickets
ORDER BY CreatedAt DESC;

PRINT '';

-- 4. Count tickets by OnBehalfOf status
PRINT '4. Ticket statistics:';
SELECT 
    COUNT(*) AS TotalTickets,
    COUNT(CASE WHEN OnBehalfOf IS NOT NULL AND OnBehalfOf != '' THEN 1 END) AS TicketsWithOnBehalfOf,
    COUNT(CASE WHEN OnBehalfOf IS NULL OR OnBehalfOf = '' THEN 1 END) AS DirectRequestTickets
FROM Tickets;

PRINT '';

-- 5. Show what the frontend should display
PRINT '5. What frontend should display:';
SELECT TOP 5
    Id,
    Title,
    CASE 
        WHEN OnBehalfOf IS NOT NULL AND OnBehalfOf != '' 
        THEN 'BADGE: "On Behalf" + NAME: "' + OnBehalfOf + '"'
        ELSE 'TEXT: "Direct request" (italic)'
    END AS FrontendDisplay,
    CreatedAt
FROM Tickets
ORDER BY CreatedAt DESC;

PRINT '';
PRINT '=== DIAGNOSTIC COMPLETE ===';
PRINT '';
PRINT 'Next steps based on results:';
PRINT '1. If OnBehalfOf column is MISSING → Run the ALTER TABLE command';
PRINT '2. If OnBehalfOf column EXISTS but all values are NULL → Backend not storing data';
PRINT '3. If OnBehalfOf has values but frontend shows "Direct Request" → Frontend/API issue';
PRINT '';

-- 6. Test query to manually add OnBehalfOf data for testing
PRINT '6. To manually test, you can run:';
PRINT 'UPDATE TOP(1) Tickets SET OnBehalfOf = ''Test Person'' WHERE Id = (SELECT TOP 1 Id FROM Tickets ORDER BY CreatedAt DESC);';
PRINT '';
PRINT 'Then check if that ticket shows "Test Person" in the frontend.';
