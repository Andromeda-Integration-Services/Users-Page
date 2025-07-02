-- =============================================
-- CAFM System - Insert Realistic Sample Tickets
-- Execute this in SSMS to add comprehensive test data
-- =============================================

USE CAFMSystem;
GO

-- First, let's check if we have users to assign tickets to
DECLARE @AdminId NVARCHAR(450), @PlumberId NVARCHAR(450), @ElectricianId NVARCHAR(450), 
        @CleanerId NVARCHAR(450), @ManagerId NVARCHAR(450), @UserId NVARCHAR(450);

-- Get user IDs for ticket assignment
SELECT @AdminId = Id FROM AspNetUsers WHERE Email = 'admin@cafm.com';
SELECT @PlumberId = Id FROM AspNetUsers WHERE Email = 'plumber@cafm.com';
SELECT @ElectricianId = Id FROM AspNetUsers WHERE Email = 'electrician@cafm.com';
SELECT @CleanerId = Id FROM AspNetUsers WHERE Email = 'cleaner@cafm.com';
SELECT @ManagerId = Id FROM AspNetUsers WHERE Email = 'manager@cafm.com';
SELECT @UserId = Id FROM AspNetUsers WHERE Email = 'user@cafm.com';

-- If users don't exist, create a default user for testing
IF @AdminId IS NULL
BEGIN
    PRINT 'Warning: Test users not found. Please ensure the backend has seeded the test users first.';
    PRINT 'Run: dotnet run in CAFMSystem.API to seed test users.';
    RETURN;
END

PRINT 'Adding realistic sample tickets...';

-- =============================================
-- PLUMBING TICKETS
-- =============================================

INSERT INTO Tickets (Title, Description, Status, Priority, Category, Location, CreatedAt, UpdatedAt, CreatedById, AssignedToId)
VALUES 
-- Recent plumbing issues
('Water leak in main lobby restroom', 'Water is leaking from the ceiling in the main lobby men''s restroom. The leak appears to be coming from the pipe above the sink area. Water is pooling on the floor creating a slip hazard.', 1, 4, 2, 'Main Lobby - Men''s Restroom', DATEADD(HOUR, -2, GETDATE()), DATEADD(HOUR, -1, GETDATE()), @UserId, @PlumberId),

('Clogged drain in kitchen sink', 'The kitchen sink in the employee break room is completely clogged. Water is backing up and not draining at all. Staff cannot wash dishes or prepare food properly.', 2, 3, 2, 'Employee Break Room - Kitchen', DATEADD(HOUR, -6, GETDATE()), DATEADD(HOUR, -4, GETDATE()), @ManagerId, @PlumberId),

('Low water pressure in 3rd floor bathrooms', 'Multiple users have reported very low water pressure in all bathrooms on the 3rd floor. Both hot and cold water are affected. The issue started yesterday morning.', 1, 2, 2, '3rd Floor - All Bathrooms', DATEADD(DAY, -1, GETDATE()), NULL, @UserId, @PlumberId),

('Toilet not flushing properly in Room 301', 'The toilet in conference room 301 is not flushing properly. The handle needs to be held down for a long time and sometimes requires multiple attempts.', 1, 2, 2, 'Conference Room 301', DATEADD(DAY, -2, GETDATE()), NULL, @AdminId, NULL),

('Hot water not working in executive washroom', 'The hot water tap in the executive washroom is only producing cold water. This has been an issue for the past 3 days.', 2, 3, 2, 'Executive Floor - Washroom', DATEADD(DAY, -3, GETDATE()), DATEADD(DAY, -2, GETDATE()), @ManagerId, @PlumberId),

-- =============================================
-- ELECTRICAL TICKETS
-- =============================================

('Power outage in conference room B', 'Complete power outage in conference room B. No lights, no outlets working. Important client meeting scheduled for tomorrow morning.', 1, 4, 3, 'Conference Room B', DATEADD(HOUR, -1, GETDATE()), NULL, @ManagerId, @ElectricianId),

('Flickering lights in hallway corridor', 'The fluorescent lights in the main hallway corridor are flickering constantly. It''s causing eye strain for employees walking through the area.', 1, 2, 3, 'Main Hallway Corridor', DATEADD(HOUR, -4, GETDATE()), NULL, @UserId, @ElectricianId),

('Electrical outlet not working in cubicle 15', 'The electrical outlet in cubicle 15 is not working. Employee cannot plug in computer or desk lamp. Affecting productivity.', 2, 2, 3, 'Open Office - Cubicle 15', DATEADD(DAY, -1, GETDATE()), DATEADD(HOUR, -8, GETDATE()), @UserId, @ElectricianId),

('Emergency lighting system failure', 'The emergency lighting system in the east wing is not functioning. During the weekly test, none of the emergency lights activated.', 1, 4, 3, 'East Wing - All Floors', DATEADD(DAY, -1, GETDATE()), NULL, @AdminId, @ElectricianId),

('Circuit breaker keeps tripping in server room', 'The main circuit breaker in the server room keeps tripping every few hours. This is causing intermittent power issues with our servers.', 1, 5, 3, 'Server Room - Basement', DATEADD(HOUR, -3, GETDATE()), NULL, @AdminId, @ElectricianId),

-- =============================================
-- HVAC TICKETS
-- =============================================

('Air conditioning not cooling in open office', 'The air conditioning system in the main open office area is running but not cooling effectively. Temperature is consistently 78°F despite thermostat set to 72°F.', 2, 3, 4, 'Main Open Office Area', DATEADD(DAY, -2, GETDATE()), DATEADD(DAY, -1, GETDATE()), @ManagerId, NULL),

('Heating system not working in north wing', 'The heating system in the north wing is completely non-functional. Employees are complaining about cold temperatures.', 1, 3, 4, 'North Wing - All Offices', DATEADD(HOUR, -8, GETDATE()), NULL, @UserId, NULL),

('Strange noise from HVAC unit on roof', 'Loud grinding noise coming from the main HVAC unit on the roof. The noise started this morning and is getting progressively louder.', 1, 3, 4, 'Roof - Main HVAC Unit', DATEADD(HOUR, -5, GETDATE()), NULL, @AdminId, NULL),

('Thermostat not responding in meeting room A', 'The digital thermostat in meeting room A is not responding to temperature adjustments. Display shows error code E3.', 1, 2, 4, 'Meeting Room A', DATEADD(DAY, -1, GETDATE()), NULL, @UserId, NULL),

-- =============================================
-- CLEANING TICKETS
-- =============================================

('Carpet stain removal needed in reception', 'Large coffee stain on the carpet in the main reception area. The stain is very visible and needs professional cleaning.', 1, 2, 5, 'Main Reception Area', DATEADD(HOUR, -3, GETDATE()), NULL, @UserId, @CleanerId),

('Deep cleaning required in conference room C', 'Conference room C needs deep cleaning after yesterday''s catered meeting. Food spills on carpet and tables need attention.', 2, 2, 5, 'Conference Room C', DATEADD(DAY, -1, GETDATE()), DATEADD(HOUR, -6, GETDATE()), @ManagerId, @CleanerId),

('Restroom supplies need restocking', 'All restrooms on the 2nd floor are out of paper towels and toilet paper. Hand soap dispensers are also empty.', 4, 1, 5, '2nd Floor - All Restrooms', DATEADD(DAY, -1, GETDATE()), DATEADD(HOUR, -2, GETDATE()), @UserId, @CleanerId),

('Window cleaning for executive offices', 'The windows in all executive offices need cleaning. They haven''t been cleaned in over a month and are affecting the professional appearance.', 1, 1, 5, 'Executive Floor - All Offices', DATEADD(DAY, -3, GETDATE()), NULL, @ManagerId, @CleanerId),

-- =============================================
-- IT TICKETS
-- =============================================

('Network connectivity issues in accounting', 'Multiple computers in the accounting department are experiencing intermittent network connectivity issues. Affecting access to financial systems.', 1, 3, 7, 'Accounting Department', DATEADD(HOUR, -2, GETDATE()), NULL, @ManagerId, NULL),

('Printer jam in main copy room', 'The main printer in the copy room has a paper jam that cannot be cleared. Error message shows "Call Service".', 2, 2, 7, 'Main Copy Room', DATEADD(HOUR, -4, GETDATE()), DATEADD(HOUR, -3, GETDATE()), @UserId, NULL),

('WiFi signal weak in conference rooms', 'WiFi signal is very weak in all conference rooms on the 4th floor. Clients and employees cannot connect reliably during meetings.', 1, 3, 7, '4th Floor - All Conference Rooms', DATEADD(DAY, -1, GETDATE()), NULL, @AdminId, NULL),

('Computer monitor flickering in HR office', 'The main computer monitor in the HR office is flickering constantly. Making it difficult to read documents and causing eye strain.', 1, 2, 7, 'HR Office', DATEADD(HOUR, -6, GETDATE()), NULL, @UserId, NULL),

-- =============================================
-- SECURITY TICKETS
-- =============================================

('Security camera not working in parking lot', 'Security camera #3 in the main parking lot is not recording. The camera appears to be powered but shows no video feed.', 1, 3, 6, 'Main Parking Lot - Camera #3', DATEADD(HOUR, -8, GETDATE()), NULL, @AdminId, NULL),

('Access card reader malfunction at main entrance', 'The access card reader at the main entrance is not reading employee cards consistently. Employees are having to try multiple times to gain entry.', 2, 3, 6, 'Main Entrance', DATEADD(DAY, -1, GETDATE()), DATEADD(HOUR, -12, GETDATE()), @ManagerId, NULL),

-- =============================================
-- MAINTENANCE TICKETS
-- =============================================

('Office chair repair needed in cubicle 22', 'The office chair in cubicle 22 has a broken wheel and the height adjustment is not working. Employee is experiencing discomfort.', 1, 2, 8, 'Open Office - Cubicle 22', DATEADD(DAY, -2, GETDATE()), NULL, @UserId, NULL),

('Paint touch-up needed in lobby walls', 'Several scuff marks and small holes in the lobby walls need paint touch-up. Affecting the professional appearance of the building.', 1, 1, 8, 'Main Lobby', DATEADD(DAY, -4, GETDATE()), NULL, @ManagerId, NULL),

('Door handle loose on supply closet', 'The door handle on the main supply closet is very loose and may fall off soon. Door is difficult to open and close properly.', 1, 2, 8, 'Main Supply Closet', DATEADD(DAY, -1, GETDATE()), NULL, @UserId, NULL);

PRINT 'Sample tickets inserted successfully!';

-- =============================================
-- ADD SOME TICKET COMMENTS
-- =============================================

PRINT 'Adding ticket comments...';

-- Get some ticket IDs for comments
DECLARE @TicketId1 INT, @TicketId2 INT, @TicketId3 INT;
SELECT TOP 1 @TicketId1 = Id FROM Tickets WHERE Title LIKE '%water leak%';
SELECT TOP 1 @TicketId2 = Id FROM Tickets WHERE Title LIKE '%power outage%';
SELECT TOP 1 @TicketId3 = Id FROM Tickets WHERE Title LIKE '%air conditioning%';

-- Add comments to tickets
IF @TicketId1 IS NOT NULL
BEGIN
    INSERT INTO TicketComments (Comment, CreatedAt, TicketId, CreatedById)
    VALUES 
    ('I''ve assessed the leak and it appears to be coming from a loose pipe joint. Will need to shut off water to this section for repairs.', DATEADD(HOUR, -1, GETDATE()), @TicketId1, @PlumberId),
    ('Water has been shut off. Repair should take about 2 hours. Will update when complete.', DATEADD(MINUTE, -30, GETDATE()), @TicketId1, @PlumberId);
END

IF @TicketId2 IS NOT NULL
BEGIN
    INSERT INTO TicketComments (Comment, CreatedAt, TicketId, CreatedById)
    VALUES 
    ('Checked the circuit breaker panel. The breaker for conference room B has tripped. Investigating the cause before resetting.', DATEADD(MINUTE, -45, GETDATE()), @TicketId2, @ElectricianId);
END

IF @TicketId3 IS NOT NULL
BEGIN
    INSERT INTO TicketComments (Comment, CreatedAt, TicketId, CreatedById)
    VALUES 
    ('HVAC technician has been contacted. They will arrive tomorrow morning to inspect the system.', DATEADD(HOUR, -4, GETDATE()), @TicketId3, @ManagerId),
    ('Temporary fans have been set up in the office to help with air circulation until repairs are complete.', DATEADD(HOUR, -2, GETDATE()), @TicketId3, @ManagerId);
END

-- =============================================
-- SUMMARY REPORT
-- =============================================

PRINT '=============================================';
PRINT 'SAMPLE DATA INSERTION COMPLETE!';
PRINT '=============================================';

-- Show summary of inserted data
SELECT 
    'Tickets Added' AS DataType,
    COUNT(*) AS Count
FROM Tickets
WHERE CreatedAt >= DATEADD(MINUTE, -5, GETDATE())

UNION ALL

SELECT 
    'Comments Added' AS DataType,
    COUNT(*) AS Count
FROM TicketComments
WHERE CreatedAt >= DATEADD(MINUTE, -5, GETDATE());

-- Show ticket distribution by category
SELECT 
    CASE Category
        WHEN 1 THEN 'General'
        WHEN 2 THEN 'Plumbing'
        WHEN 3 THEN 'Electrical'
        WHEN 4 THEN 'HVAC'
        WHEN 5 THEN 'Cleaning'
        WHEN 6 THEN 'Security'
        WHEN 7 THEN 'IT'
        WHEN 8 THEN 'Maintenance'
        WHEN 9 THEN 'Safety'
        WHEN 10 THEN 'Other'
    END AS Category,
    COUNT(*) AS TicketCount
FROM Tickets
GROUP BY Category
ORDER BY TicketCount DESC;

PRINT 'You now have realistic sample tickets to work with!';
PRINT 'Visit your CAFM dashboard to see the new data.';
