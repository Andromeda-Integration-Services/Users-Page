-- =============================================
-- CAFM System - Role-Based Access Control Test
-- Test assignment-based ticket visibility
-- =============================================

USE CAFMSystem;
GO

-- Get user IDs for testing
DECLARE @AdminId NVARCHAR(450), @PlumberId NVARCHAR(450), @ElectricianId NVARCHAR(450), 
        @CleanerId NVARCHAR(450), @ManagerId NVARCHAR(450), @UserId NVARCHAR(450);

SELECT @AdminId = Id FROM AspNetUsers WHERE Email = 'admin@cafm.com';
SELECT @PlumberId = Id FROM AspNetUsers WHERE Email = 'plumber@cafm.com';
SELECT @ElectricianId = Id FROM AspNetUsers WHERE Email = 'electrician@cafm.com';
SELECT @CleanerId = Id FROM AspNetUsers WHERE Email = 'cleaner@cafm.com';
SELECT @ManagerId = Id FROM AspNetUsers WHERE Email = 'manager@cafm.com';
SELECT @UserId = Id FROM AspNetUsers WHERE Email = 'user@cafm.com';

-- Clear existing test tickets
DELETE FROM TicketComments WHERE TicketId IN (SELECT Id FROM Tickets WHERE Title LIKE '%[TEST]%');
DELETE FROM Tickets WHERE Title LIKE '%[TEST]%';

PRINT 'Creating test tickets for role-based access control testing...';

-- Test Scenario 1: Plumber-specific tickets
INSERT INTO Tickets (Title, Description, Status, Priority, Category, Type, Location, CreatedAt, CreatedById, AssignedToId)
VALUES 
-- Ticket created by EndUser, assigned to Plumber
('[TEST] Plumber Assignment - Water leak in kitchen', 
 'Water is leaking from the kitchen sink. Needs immediate plumber attention.', 
 1, 4, 2, 2, 'Kitchen Area', GETDATE(), @UserId, @PlumberId),

-- Ticket created by Plumber themselves
('[TEST] Plumber Created - Pipe inspection needed', 
 'Regular pipe inspection in basement area.', 
 1, 2, 2, 2, 'Basement', GETDATE(), @PlumberId, NULL),

-- Ticket created by EndUser, assigned to Electrician (Plumber should NOT see this)
('[TEST] Electrician Assignment - Light fixture repair', 
 'Light fixture in conference room needs repair.', 
 1, 3, 3, 2, 'Conference Room', GETDATE(), @UserId, @ElectricianId);

-- Test Scenario 2: Electrician-specific tickets
INSERT INTO Tickets (Title, Description, Status, Priority, Category, Type, Location, CreatedAt, CreatedById, AssignedToId)
VALUES 
-- Ticket created by EndUser, assigned to Electrician
('[TEST] Electrician Assignment - Power outlet not working', 
 'Power outlet in office 205 is not working.', 
 1, 3, 3, 2, 'Office 205', GETDATE(), @UserId, @ElectricianId),

-- Ticket created by Electrician themselves
('[TEST] Electrician Created - Electrical safety check', 
 'Monthly electrical safety inspection.', 
 1, 2, 3, 2, 'Main Building', GETDATE(), @ElectricianId, NULL),

-- Ticket created by EndUser, assigned to Cleaner (Electrician should NOT see this)
('[TEST] Cleaner Assignment - Carpet cleaning needed', 
 'Carpet in lobby needs deep cleaning.', 
 1, 2, 5, 2, 'Main Lobby', GETDATE(), @UserId, @CleanerId);

-- Test Scenario 3: Cleaner-specific tickets
INSERT INTO Tickets (Title, Description, Status, Priority, Category, Type, Location, CreatedAt, CreatedById, AssignedToId)
VALUES 
-- Ticket created by EndUser, assigned to Cleaner
('[TEST] Cleaner Assignment - Restroom supplies needed', 
 'Restroom on 3rd floor needs restocking.', 
 1, 2, 5, 1, '3rd Floor Restroom', GETDATE(), @UserId, @CleanerId),

-- Ticket created by Cleaner themselves
('[TEST] Cleaner Created - Weekly deep clean', 
 'Weekly deep cleaning of conference rooms.', 
 1, 1, 5, 2, 'All Conference Rooms', GETDATE(), @CleanerId, NULL);

-- Test Scenario 4: Unassigned tickets (only Admin/AssetManager should see these)
INSERT INTO Tickets (Title, Description, Status, Priority, Category, Type, Location, CreatedAt, CreatedById, AssignedToId)
VALUES 
('[TEST] Unassigned - General maintenance request', 
 'General maintenance needed in parking area.', 
 1, 2, 8, 2, 'Parking Area', GETDATE(), @UserId, NULL),

('[TEST] Unassigned - Security system check', 
 'Security system needs routine check.', 
 1, 3, 6, 2, 'Main Entrance', GETDATE(), @UserId, NULL);

PRINT 'Test tickets created successfully!';
PRINT '';
PRINT '=== ROLE-BASED ACCESS CONTROL TEST SCENARIOS ===';
PRINT '';
PRINT '1. PLUMBER should see:';
PRINT '   - [TEST] Plumber Assignment - Water leak in kitchen (assigned to them)';
PRINT '   - [TEST] Plumber Created - Pipe inspection needed (created by them)';
PRINT '   - Should NOT see electrician or cleaner assigned tickets';
PRINT '';
PRINT '2. ELECTRICIAN should see:';
PRINT '   - [TEST] Electrician Assignment - Power outlet not working (assigned to them)';
PRINT '   - [TEST] Electrician Created - Electrical safety check (created by them)';
PRINT '   - Should NOT see plumber or cleaner assigned tickets';
PRINT '';
PRINT '3. CLEANER should see:';
PRINT '   - [TEST] Cleaner Assignment - Restroom supplies needed (assigned to them)';
PRINT '   - [TEST] Cleaner Created - Weekly deep clean (created by them)';
PRINT '   - Should NOT see plumber or electrician assigned tickets';
PRINT '';
PRINT '4. END USER should see:';
PRINT '   - All [TEST] tickets they created (multiple tickets)';
PRINT '   - Should NOT see tickets created by service providers';
PRINT '';
PRINT '5. ADMIN/ASSET MANAGER should see:';
PRINT '   - ALL [TEST] tickets including unassigned ones';
PRINT '';
PRINT 'Test the API endpoints with different user tokens to verify access control!';

-- Display current test tickets for verification
SELECT 
    t.Id,
    t.Title,
    t.Status,
    t.Priority,
    t.Category,
    createdBy.Email AS CreatedBy,
    assignedTo.Email AS AssignedTo,
    t.CreatedAt
FROM Tickets t
LEFT JOIN AspNetUsers createdBy ON t.CreatedById = createdBy.Id
LEFT JOIN AspNetUsers assignedTo ON t.AssignedToId = assignedTo.Id
WHERE t.Title LIKE '%[TEST]%'
ORDER BY t.CreatedAt DESC;
