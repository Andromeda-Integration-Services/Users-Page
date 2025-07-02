-- =============================================
-- CAFM System - SSMS Testing Queries
-- Complete SQL Query Collection for Database Testing
-- =============================================

-- Use the CAFM database
USE CAFMSystem;
GO

-- =============================================
-- 1. DATABASE OVERVIEW & STRUCTURE
-- =============================================

PRINT '=== DATABASE OVERVIEW ===';

-- Show all tables in the database
SELECT 
    TABLE_SCHEMA,
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Show table row counts
SELECT 
    t.name AS TableName,
    p.rows AS RowCount
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id < 2
ORDER BY p.rows DESC;

-- =============================================
-- 2. USER MANAGEMENT QUERIES
-- =============================================

PRINT '=== USER MANAGEMENT ===';

-- Show all users with their details
SELECT 
    Id,
    UserName,
    Email,
    FirstName,
    LastName,
    Department,
    EmployeeId,
    PhoneNumber,
    EmailConfirmed,
    IsActive,
    CreatedAt,
    LastLoginAt,
    CONCAT(FirstName, ' ', LastName) AS FullName
FROM AspNetUsers
ORDER BY CreatedAt DESC;

-- Count users by department
SELECT 
    Department,
    COUNT(*) AS UserCount,
    COUNT(CASE WHEN IsActive = 1 THEN 1 END) AS ActiveUsers,
    COUNT(CASE WHEN IsActive = 0 THEN 1 END) AS InactiveUsers
FROM AspNetUsers
WHERE Department IS NOT NULL AND Department != ''
GROUP BY Department
ORDER BY UserCount DESC;

-- Show user roles
SELECT 
    u.UserName,
    u.Email,
    u.FirstName,
    u.LastName,
    r.Name AS RoleName
FROM AspNetUsers u
INNER JOIN AspNetUserRoles ur ON u.Id = ur.UserId
INNER JOIN AspNetRoles r ON ur.RoleId = r.Id
ORDER BY r.Name, u.LastName;

-- Count users by role
SELECT 
    r.Name AS RoleName,
    COUNT(ur.UserId) AS UserCount
FROM AspNetRoles r
LEFT JOIN AspNetUserRoles ur ON r.Id = ur.RoleId
GROUP BY r.Name
ORDER BY UserCount DESC;

-- =============================================
-- 3. TICKET MANAGEMENT QUERIES
-- =============================================

PRINT '=== TICKET MANAGEMENT ===';

-- Show all tickets with user details
SELECT 
    t.Id,
    t.Title,
    t.Description,
    t.Status,
    t.Priority,
    t.Category,
    t.Location,
    t.CreatedAt,
    t.UpdatedAt,
    t.CompletedAt,
    t.DueDate,
    creator.FirstName + ' ' + creator.LastName AS CreatedBy,
    creator.Email AS CreatorEmail,
    creator.Department AS CreatorDepartment,
    assignee.FirstName + ' ' + assignee.LastName AS AssignedTo,
    assignee.Email AS AssigneeEmail,
    assignee.Department AS AssigneeDepartment
FROM Tickets t
INNER JOIN AspNetUsers creator ON t.CreatedById = creator.Id
LEFT JOIN AspNetUsers assignee ON t.AssignedToId = assignee.Id
ORDER BY t.CreatedAt DESC;

-- Ticket statistics by status
SELECT 
    Status,
    COUNT(*) AS TicketCount,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Tickets), 2) AS Percentage
FROM Tickets
GROUP BY Status
ORDER BY TicketCount DESC;

-- Ticket statistics by priority
SELECT 
    Priority,
    COUNT(*) AS TicketCount,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Tickets), 2) AS Percentage
FROM Tickets
GROUP BY Priority
ORDER BY 
    CASE Priority
        WHEN 5 THEN 1  -- Emergency
        WHEN 4 THEN 2  -- Critical
        WHEN 3 THEN 3  -- High
        WHEN 2 THEN 4  -- Medium
        WHEN 1 THEN 5  -- Low
    END;

-- Ticket statistics by category
SELECT 
    Category,
    COUNT(*) AS TicketCount,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Tickets), 2) AS Percentage
FROM Tickets
GROUP BY Category
ORDER BY TicketCount DESC;

-- Tickets created in the last 30 days
SELECT 
    CAST(t.CreatedAt AS DATE) AS Date,
    COUNT(*) AS TicketsCreated,
    STRING_AGG(t.Title, '; ') AS TicketTitles
FROM Tickets t
WHERE t.CreatedAt >= DATEADD(DAY, -30, GETDATE())
GROUP BY CAST(t.CreatedAt AS DATE)
ORDER BY Date DESC;

-- =============================================
-- 4. PERFORMANCE & WORKLOAD ANALYSIS
-- =============================================

PRINT '=== PERFORMANCE ANALYSIS ===';

-- User workload analysis
SELECT 
    u.FirstName + ' ' + u.LastName AS UserName,
    u.Email,
    u.Department,
    COUNT(created.Id) AS TicketsCreated,
    COUNT(assigned.Id) AS TicketsAssigned,
    COUNT(CASE WHEN assigned.Status IN (1, 2) THEN 1 END) AS OpenAssignedTickets
FROM AspNetUsers u
LEFT JOIN Tickets created ON u.Id = created.CreatedById
LEFT JOIN Tickets assigned ON u.Id = assigned.AssignedToId
GROUP BY u.Id, u.FirstName, u.LastName, u.Email, u.Department
HAVING COUNT(created.Id) > 0 OR COUNT(assigned.Id) > 0
ORDER BY TicketsCreated DESC, TicketsAssigned DESC;

-- Department workload analysis
SELECT 
    u.Department,
    COUNT(DISTINCT u.Id) AS TotalUsers,
    COUNT(t.Id) AS TotalTickets,
    COUNT(CASE WHEN t.Status IN (1, 2) THEN 1 END) AS OpenTickets,
    COUNT(CASE WHEN t.Status = 4 THEN 1 END) AS ResolvedTickets,
    ROUND(AVG(CASE WHEN t.CompletedAt IS NOT NULL 
        THEN DATEDIFF(HOUR, t.CreatedAt, t.CompletedAt) END), 2) AS AvgResolutionHours
FROM AspNetUsers u
LEFT JOIN Tickets t ON u.Id = t.CreatedById OR u.Id = t.AssignedToId
WHERE u.Department IS NOT NULL AND u.Department != ''
GROUP BY u.Department
ORDER BY TotalTickets DESC;

-- =============================================
-- 5. TICKET COMMENTS ANALYSIS
-- =============================================

PRINT '=== TICKET COMMENTS ===';

-- Show all comments with ticket and user details
SELECT 
    tc.Id,
    tc.Comment,
    tc.CreatedAt,
    t.Id AS TicketId,
    t.Title AS TicketTitle,
    u.FirstName + ' ' + u.LastName AS CommentBy,
    u.Email AS CommentByEmail
FROM TicketComments tc
INNER JOIN Tickets t ON tc.TicketId = t.Id
INNER JOIN AspNetUsers u ON tc.CreatedById = u.Id
ORDER BY tc.CreatedAt DESC;

-- Tickets with most comments
SELECT 
    t.Id,
    t.Title,
    t.Status,
    COUNT(tc.Id) AS CommentCount,
    MAX(tc.CreatedAt) AS LastCommentDate
FROM Tickets t
LEFT JOIN TicketComments tc ON t.Id = tc.TicketId
GROUP BY t.Id, t.Title, t.Status
HAVING COUNT(tc.Id) > 0
ORDER BY CommentCount DESC;

-- =============================================
-- 6. DATA QUALITY CHECKS
-- =============================================

PRINT '=== DATA QUALITY CHECKS ===';

-- Check for tickets without assigned users
SELECT 
    Id,
    Title,
    Status,
    Priority,
    Category,
    CreatedAt
FROM Tickets
WHERE AssignedToId IS NULL
ORDER BY Priority DESC, CreatedAt DESC;

-- Check for users without departments
SELECT 
    Id,
    UserName,
    Email,
    FirstName,
    LastName,
    CreatedAt
FROM AspNetUsers
WHERE Department IS NULL OR Department = ''
ORDER BY CreatedAt DESC;

-- Check for overdue tickets (assuming 7 days for resolution)
SELECT 
    t.Id,
    t.Title,
    t.Status,
    t.Priority,
    t.CreatedAt,
    DATEDIFF(DAY, t.CreatedAt, GETDATE()) AS DaysOpen,
    creator.FirstName + ' ' + creator.LastName AS CreatedBy,
    assignee.FirstName + ' ' + assignee.LastName AS AssignedTo
FROM Tickets t
INNER JOIN AspNetUsers creator ON t.CreatedById = creator.Id
LEFT JOIN AspNetUsers assignee ON t.AssignedToId = assignee.Id
WHERE t.Status IN (1, 2) -- Open or In Progress
    AND DATEDIFF(DAY, t.CreatedAt, GETDATE()) > 7
ORDER BY DaysOpen DESC;

PRINT '=== QUERY EXECUTION COMPLETE ===';
PRINT 'All CAFM system data has been analyzed successfully!';
