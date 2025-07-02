-- Add DepartmentId column to AspNetUsers table
USE CAFMSystem;
GO

-- Check if column already exists
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUsers]') AND name = 'DepartmentId')
BEGIN
    -- Add the DepartmentId column
    ALTER TABLE [dbo].[AspNetUsers]
    ADD [DepartmentId] nvarchar(20) NOT NULL DEFAULT '';
    
    PRINT 'DepartmentId column added successfully.';
END
ELSE
BEGIN
    PRINT 'DepartmentId column already exists.';
END
GO

-- Create index on DepartmentId if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUsers]') AND name = 'IX_AspNetUsers_DepartmentId')
BEGIN
    CREATE INDEX [IX_AspNetUsers_DepartmentId] ON [dbo].[AspNetUsers] ([DepartmentId]);
    PRINT 'Index on DepartmentId created successfully.';
END
ELSE
BEGIN
    PRINT 'Index on DepartmentId already exists.';
END
GO

-- Update existing users with department IDs based on their department
UPDATE [dbo].[AspNetUsers] 
SET [DepartmentId] = 
    CASE 
        WHEN LOWER([Department]) = 'administration' THEN 'ADM' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'facilities' THEN 'FAC' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'maintenance' THEN 'MNT' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'plumbing' THEN 'PLB' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'electrical' THEN 'ELC' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'cleaning' THEN 'CLN' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'hvac' THEN 'HVC' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'security' THEN 'SEC' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'it' THEN 'ITS' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'finance' THEN 'FIN' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'hr' THEN 'HRS' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        WHEN LOWER([Department]) = 'general' THEN 'GEN' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
        ELSE 'USR' + RIGHT('000' + CAST(ROW_NUMBER() OVER (PARTITION BY LOWER([Department]) ORDER BY [CreatedAt]) AS VARCHAR(3)), 3)
    END
WHERE [DepartmentId] = '' OR [DepartmentId] IS NULL;

PRINT 'Existing users updated with department IDs.';
GO

-- Show updated users
SELECT 
    [Id],
    [FirstName] + ' ' + [LastName] AS [FullName],
    [Email],
    [Department],
    [DepartmentId],
    [EmployeeId]
FROM [dbo].[AspNetUsers]
ORDER BY [Department], [DepartmentId];

PRINT 'Department ID setup completed successfully!';
