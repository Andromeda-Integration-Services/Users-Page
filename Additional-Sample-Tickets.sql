-- =============================================
-- CAFM System - Additional Diverse Sample Tickets
-- Run this after Insert-Sample-Tickets.sql for more variety
-- =============================================

USE CAFMSystem;
GO

-- Get user IDs for ticket assignment
DECLARE @AdminId NVARCHAR(450), @PlumberId NVARCHAR(450), @ElectricianId NVARCHAR(450), 
        @CleanerId NVARCHAR(450), @ManagerId NVARCHAR(450), @UserId NVARCHAR(450);

SELECT @AdminId = Id FROM AspNetUsers WHERE Email = 'admin@cafm.com';
SELECT @PlumberId = Id FROM AspNetUsers WHERE Email = 'plumber@cafm.com';
SELECT @ElectricianId = Id FROM AspNetUsers WHERE Email = 'electrician@cafm.com';
SELECT @CleanerId = Id FROM AspNetUsers WHERE Email = 'cleaner@cafm.com';
SELECT @ManagerId = Id FROM AspNetUsers WHERE Email = 'manager@cafm.com';
SELECT @UserId = Id FROM AspNetUsers WHERE Email = 'user@cafm.com';

PRINT 'Adding additional diverse sample tickets...';

-- =============================================
-- COMPLETED TICKETS (Historical Data)
-- =============================================

INSERT INTO Tickets (Title, Description, Status, Priority, Category, Location, CreatedAt, UpdatedAt, CompletedAt, CreatedById, AssignedToId)
VALUES 
-- Completed plumbing work
('Faucet replacement in break room', 'Replaced old leaky faucet in employee break room. New faucet installed and tested. No leaks detected.', 4, 2, 2, 'Employee Break Room', DATEADD(DAY, -7, GETDATE()), DATEADD(DAY, -6, GETDATE()), DATEADD(DAY, -6, GETDATE()), @UserId, @PlumberId),

('Toilet repair in 2nd floor restroom', 'Fixed running toilet in 2nd floor women''s restroom. Replaced flapper valve and adjusted chain length.', 4, 2, 2, '2nd Floor - Women''s Restroom', DATEADD(DAY, -10, GETDATE()), DATEADD(DAY, -9, GETDATE()), DATEADD(DAY, -9, GETDATE()), @ManagerId, @PlumberId),

-- Completed electrical work
('Light fixture installation in meeting room', 'Installed new LED light fixtures in meeting room D. Improved lighting quality and energy efficiency.', 4, 2, 3, 'Meeting Room D', DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -4, GETDATE()), DATEADD(DAY, -4, GETDATE()), @AdminId, @ElectricianId),

('Outlet repair in accounting office', 'Repaired faulty electrical outlet in accounting office. Replaced outlet and checked wiring for safety.', 4, 3, 3, 'Accounting Office', DATEADD(DAY, -8, GETDATE()), DATEADD(DAY, -7, GETDATE()), DATEADD(DAY, -7, GETDATE()), @UserId, @ElectricianId),

-- Completed cleaning tasks
('Deep carpet cleaning in conference rooms', 'Performed deep carpet cleaning in all conference rooms. Stains removed and carpets sanitized.', 4, 1, 5, 'All Conference Rooms', DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, -2, GETDATE()), @ManagerId, @CleanerId),

-- =============================================
-- URGENT/EMERGENCY TICKETS
-- =============================================

('EMERGENCY: Gas leak detected in basement', 'Strong gas odor detected in basement storage area. Area has been evacuated. Gas company has been notified.', 1, 5, 9, 'Basement Storage Area', DATEADD(MINUTE, -30, GETDATE()), NULL, NULL, @AdminId, NULL),

('CRITICAL: Elevator stuck between floors', 'Main elevator is stuck between 2nd and 3rd floors with passengers inside. Fire department has been called.', 1, 5, 8, 'Main Elevator', DATEADD(MINUTE, -45, GETDATE()), NULL, NULL, @AdminId, NULL),

('Water main break in parking lot', 'Major water main break in employee parking lot. Water is flooding the area and affecting building water pressure.', 1, 5, 2, 'Employee Parking Lot', DATEADD(HOUR, -1, GETDATE()), NULL, NULL, @ManagerId, @PlumberId),

-- =============================================
-- ROUTINE MAINTENANCE TICKETS
-- =============================================

('Monthly HVAC filter replacement', 'Scheduled monthly replacement of HVAC filters throughout the building. All units need new filters.', 1, 1, 4, 'All HVAC Units', DATEADD(DAY, -1, GETDATE()), NULL, NULL, @ManagerId, NULL),

('Quarterly fire extinguisher inspection', 'Quarterly inspection of all fire extinguishers in the building. Check pressure, tags, and accessibility.', 1, 2, 9, 'All Floors', DATEADD(HOUR, -12, GETDATE()), NULL, NULL, @AdminId, NULL),

('Weekly restroom supply check', 'Weekly check and restocking of all restroom supplies including toilet paper, paper towels, and soap.', 1, 1, 5, 'All Restrooms', DATEADD(HOUR, -6, GETDATE()), NULL, NULL, @CleanerId, @CleanerId),

-- =============================================
-- IT AND TECHNOLOGY TICKETS
-- =============================================

('Server room temperature monitoring', 'Server room temperature has been fluctuating. Need to check HVAC system and temperature sensors.', 1, 3, 7, 'Server Room', DATEADD(HOUR, -4, GETDATE()), NULL, NULL, @AdminId, NULL),

('Conference room projector not working', 'Projector in conference room A is not displaying properly. Screen shows "No Signal" message.', 2, 2, 7, 'Conference Room A', DATEADD(HOUR, -8, GETDATE()), DATEADD(HOUR, -6, GETDATE()), NULL, @UserId, NULL),

('Network switch replacement needed', 'Network switch in telecommunications closet is showing error lights. Intermittent connectivity issues reported.', 1, 3, 7, 'Telecommunications Closet', DATEADD(DAY, -1, GETDATE()), NULL, NULL, @AdminId, NULL),

-- =============================================
-- SAFETY AND SECURITY TICKETS
-- =============================================

('Emergency exit light not working', 'Emergency exit light above main entrance is not illuminated. This is a safety code violation.', 1, 4, 9, 'Main Entrance', DATEADD(HOUR, -3, GETDATE()), NULL, NULL, @AdminId, NULL),

('Broken window in 4th floor office', 'Window in office 401 has a large crack. Potential safety hazard and security concern.', 1, 3, 8, 'Office 401', DATEADD(DAY, -2, GETDATE()), NULL, NULL, @UserId, NULL),

('Parking lot lighting insufficient', 'Several light poles in the parking lot are not working. Poor visibility creating security concerns.', 1, 2, 6, 'Employee Parking Lot', DATEADD(DAY, -3, GETDATE()), NULL, NULL, @ManagerId, @ElectricianId),

-- =============================================
-- CANCELLED TICKETS
-- =============================================

('Noise complaint from neighboring office', 'Complaint about noise from HVAC system. Investigation showed noise is within normal parameters.', 6, 2, 4, 'North Wing Office', DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -4, GETDATE()), NULL, @UserId, NULL),

('Request for additional parking spaces', 'Request to create additional parking spaces. Determined to be outside scope of current budget.', 6, 1, 1, 'Parking Area', DATEADD(DAY, -14, GETDATE()), DATEADD(DAY, -10, GETDATE()), NULL, @ManagerId, NULL),

-- =============================================
-- ON HOLD TICKETS
-- =============================================

('Roof repair for water damage', 'Roof repair needed to prevent water damage. Waiting for contractor availability and weather conditions.', 3, 3, 8, 'Building Roof', DATEADD(DAY, -6, GETDATE()), DATEADD(DAY, -4, GETDATE()), NULL, @AdminId, NULL),

('Office renovation planning', 'Planning for office renovation in east wing. Waiting for budget approval and design finalization.', 3, 1, 8, 'East Wing Offices', DATEADD(DAY, -15, GETDATE()), DATEADD(DAY, -10, GETDATE()), NULL, @ManagerId, NULL);

-- =============================================
-- ADD REALISTIC COMMENTS TO RECENT TICKETS
-- =============================================

PRINT 'Adding realistic comments to tickets...';

-- Get some recent ticket IDs
DECLARE @RecentTickets TABLE (Id INT, Title NVARCHAR(200));
INSERT INTO @RecentTickets (Id, Title)
SELECT TOP 5 Id, Title FROM Tickets 
WHERE CreatedAt >= DATEADD(MINUTE, -5, GETDATE())
ORDER BY CreatedAt DESC;

-- Add comments to recent tickets
DECLARE @TicketId INT, @TicketTitle NVARCHAR(200);
DECLARE ticket_cursor CURSOR FOR SELECT Id, Title FROM @RecentTickets;

OPEN ticket_cursor;
FETCH NEXT FROM ticket_cursor INTO @TicketId, @TicketTitle;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Add initial assessment comment
    INSERT INTO TicketComments (Comment, CreatedAt, TicketId, CreatedById)
    VALUES 
    ('Initial assessment completed. Investigating the issue and will provide update within 2 hours.', 
     DATEADD(MINUTE, -FLOOR(RAND() * 60), GETDATE()), @TicketId, @ManagerId);
    
    -- Add progress update for some tickets
    IF RAND() > 0.5
    BEGIN
        INSERT INTO TicketComments (Comment, CreatedAt, TicketId, CreatedById)
        VALUES 
        ('Work in progress. Estimated completion time is end of business day.', 
         DATEADD(MINUTE, -FLOOR(RAND() * 30), GETDATE()), @TicketId, 
         CASE WHEN @TicketTitle LIKE '%electrical%' OR @TicketTitle LIKE '%power%' OR @TicketTitle LIKE '%light%' THEN @ElectricianId
              WHEN @TicketTitle LIKE '%water%' OR @TicketTitle LIKE '%plumb%' OR @TicketTitle LIKE '%leak%' THEN @PlumberId
              WHEN @TicketTitle LIKE '%clean%' OR @TicketTitle LIKE '%carpet%' OR @TicketTitle LIKE '%restroom%' THEN @CleanerId
              ELSE @ManagerId
         END);
    END
    
    FETCH NEXT FROM ticket_cursor INTO @TicketId, @TicketTitle;
END

CLOSE ticket_cursor;
DEALLOCATE ticket_cursor;

-- =============================================
-- SUMMARY AND STATISTICS
-- =============================================

PRINT '=============================================';
PRINT 'ADDITIONAL SAMPLE DATA INSERTION COMPLETE!';
PRINT '=============================================';

-- Show comprehensive ticket statistics
SELECT 
    'Total Tickets' AS Metric,
    COUNT(*) AS Count
FROM Tickets

UNION ALL

SELECT 
    'Open Tickets' AS Metric,
    COUNT(*) AS Count
FROM Tickets
WHERE Status = 1

UNION ALL

SELECT 
    'In Progress Tickets' AS Metric,
    COUNT(*) AS Count
FROM Tickets
WHERE Status = 2

UNION ALL

SELECT 
    'Completed Tickets' AS Metric,
    COUNT(*) AS Count
FROM Tickets
WHERE Status = 4

UNION ALL

SELECT 
    'Emergency Tickets' AS Metric,
    COUNT(*) AS Count
FROM Tickets
WHERE Priority = 5

UNION ALL

SELECT 
    'Total Comments' AS Metric,
    COUNT(*) AS Count
FROM TicketComments;

-- Show ticket distribution by status
PRINT '';
PRINT 'Ticket Distribution by Status:';
SELECT 
    CASE Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'In Progress'
        WHEN 3 THEN 'On Hold'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Closed'
        WHEN 6 THEN 'Cancelled'
    END AS Status,
    COUNT(*) AS Count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Tickets), 1) AS Percentage
FROM Tickets
GROUP BY Status
ORDER BY Status;

-- Show recent activity
PRINT '';
PRINT 'Recent Activity (Last 24 Hours):';
SELECT 
    COUNT(*) AS NewTickets
FROM Tickets
WHERE CreatedAt >= DATEADD(DAY, -1, GETDATE());

PRINT '';
PRINT 'Your CAFM system now has comprehensive realistic data!';
PRINT 'Visit http://localhost:5173/dashboard to see all the new tickets.';
PRINT '=============================================';
