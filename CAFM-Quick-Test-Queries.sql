-- =============================================
-- CAFM System - Quick Test Queries
-- Fast verification queries for SSMS testing
-- =============================================

USE CAFMSystem;
GO

-- =============================================
-- QUICK SYSTEM OVERVIEW
-- =============================================

PRINT '=== CAFM SYSTEM QUICK TEST ===';
PRINT 'Database: CAFMSystem';
PRINT 'Test Date: ' + CAST(GETDATE() AS VARCHAR(50));
PRINT '==========================================';

-- 1. Check if all main tables exist
SELECT 
    'Table Existence Check' AS TestType,
    CASE 
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AspNetUsers') 
        THEN 'PASS' ELSE 'FAIL' 
    END AS Users_Table,
    CASE 
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AspNetRoles') 
        THEN 'PASS' ELSE 'FAIL' 
    END AS Roles_Table,
    CASE 
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Tickets') 
        THEN 'PASS' ELSE 'FAIL' 
    END AS Tickets_Table,
    CASE 
        WHEN EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'TicketComments') 
        THEN 'PASS' ELSE 'FAIL' 
    END AS Comments_Table;

-- 2. Quick data count summary
SELECT 
    'Data Count Summary' AS TestType,
    (SELECT COUNT(*) FROM AspNetUsers) AS Total_Users,
    (SELECT COUNT(*) FROM AspNetUsers WHERE IsActive = 1) AS Active_Users,
    (SELECT COUNT(*) FROM AspNetRoles) AS Total_Roles,
    (SELECT COUNT(*) FROM Tickets) AS Total_Tickets,
    (SELECT COUNT(*) FROM TicketComments) AS Total_Comments;

-- =============================================
-- USER VERIFICATION
-- =============================================

PRINT '=== USER VERIFICATION ===';

-- Show first 10 users
SELECT TOP 10
    Id,
    UserName,
    Email,
    FirstName,
    LastName,
    Department,
    EmployeeId,
    IsActive,
    CreatedAt
FROM AspNetUsers
ORDER BY CreatedAt DESC;

-- Show all roles and user counts
SELECT 
    r.Name AS RoleName,
    COUNT(ur.UserId) AS UserCount
FROM AspNetRoles r
LEFT JOIN AspNetUserRoles ur ON r.Id = ur.RoleId
GROUP BY r.Id, r.Name
ORDER BY UserCount DESC;

-- =============================================
-- TICKET VERIFICATION
-- =============================================

PRINT '=== TICKET VERIFICATION ===';

-- Show latest 10 tickets
SELECT TOP 10
    t.Id,
    t.Title,
    CASE t.Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'InProgress'
        WHEN 3 THEN 'OnHold'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Closed'
        WHEN 6 THEN 'Cancelled'
        ELSE 'Unknown'
    END AS Status,
    CASE t.Priority
        WHEN 1 THEN 'Low'
        WHEN 2 THEN 'Medium'
        WHEN 3 THEN 'High'
        WHEN 4 THEN 'Critical'
        WHEN 5 THEN 'Emergency'
        ELSE 'Unknown'
    END AS Priority,
    CASE t.Category
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
        ELSE 'Unknown'
    END AS Category,
    t.CreatedAt,
    u.FirstName + ' ' + u.LastName AS CreatedBy
FROM Tickets t
INNER JOIN AspNetUsers u ON t.CreatedById = u.Id
ORDER BY t.CreatedAt DESC;

-- Ticket status summary
SELECT 
    CASE Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'InProgress'
        WHEN 3 THEN 'OnHold'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Closed'
        WHEN 6 THEN 'Cancelled'
        ELSE 'Unknown'
    END AS Status,
    COUNT(*) AS Count
FROM Tickets
GROUP BY Status
ORDER BY Status;

-- =============================================
-- RELATIONSHIP VERIFICATION
-- =============================================

PRINT '=== RELATIONSHIP VERIFICATION ===';

-- Test user-ticket relationships
SELECT 
    'User-Ticket Relationships' AS TestType,
    COUNT(DISTINCT t.CreatedById) AS Users_Who_Created_Tickets,
    COUNT(DISTINCT t.AssignedToId) AS Users_With_Assigned_Tickets,
    COUNT(*) AS Total_Tickets
FROM Tickets t;

-- Test ticket-comment relationships
SELECT 
    'Ticket-Comment Relationships' AS TestType,
    COUNT(DISTINCT tc.TicketId) AS Tickets_With_Comments,
    COUNT(*) AS Total_Comments,
    ROUND(AVG(CAST(comment_count AS FLOAT)), 2) AS Avg_Comments_Per_Ticket
FROM TicketComments tc
CROSS APPLY (
    SELECT COUNT(*) AS comment_count 
    FROM TicketComments tc2 
    WHERE tc2.TicketId = tc.TicketId
) cc;

-- =============================================
-- SAMPLE DATA QUERIES
-- =============================================

PRINT '=== SAMPLE DATA QUERIES ===';

-- Find admin users
SELECT 
    u.Email,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.Department,
    r.Name AS Role
FROM AspNetUsers u
INNER JOIN AspNetUserRoles ur ON u.Id = ur.UserId
INNER JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE r.Name = 'Admin';

-- Find high priority open tickets
SELECT 
    t.Id,
    t.Title,
    t.Priority,
    t.CreatedAt,
    u.FirstName + ' ' + u.LastName AS CreatedBy,
    assignee.FirstName + ' ' + assignee.LastName AS AssignedTo
FROM Tickets t
INNER JOIN AspNetUsers u ON t.CreatedById = u.Id
LEFT JOIN AspNetUsers assignee ON t.AssignedToId = assignee.Id
WHERE t.Status IN (1, 2) AND t.Priority >= 3
ORDER BY t.Priority DESC, t.CreatedAt ASC;

-- Find recent activity (last 7 days)
SELECT 
    'Recent Tickets' AS ActivityType,
    COUNT(*) AS Count
FROM Tickets
WHERE CreatedAt >= DATEADD(DAY, -7, GETDATE())

UNION ALL

SELECT 
    'Recent Comments' AS ActivityType,
    COUNT(*) AS Count
FROM TicketComments
WHERE CreatedAt >= DATEADD(DAY, -7, GETDATE())

UNION ALL

SELECT 
    'Recent User Registrations' AS ActivityType,
    COUNT(*) AS Count
FROM AspNetUsers
WHERE CreatedAt >= DATEADD(DAY, -7, GETDATE());

-- =============================================
-- SYSTEM HEALTH CHECK
-- =============================================

PRINT '=== SYSTEM HEALTH CHECK ===';

-- Check for potential issues
SELECT 
    'Health Check' AS CheckType,
    CASE 
        WHEN (SELECT COUNT(*) FROM AspNetUsers WHERE IsActive = 1) > 0 
        THEN 'PASS' ELSE 'FAIL' 
    END AS Active_Users_Exist,
    CASE 
        WHEN (SELECT COUNT(*) FROM AspNetRoles) >= 6 
        THEN 'PASS' ELSE 'FAIL' 
    END AS Required_Roles_Exist,
    CASE 
        WHEN (SELECT COUNT(*) FROM Tickets WHERE AssignedToId IS NULL AND Status IN (1,2)) < 
             (SELECT COUNT(*) FROM Tickets WHERE Status IN (1,2)) * 0.5
        THEN 'PASS' ELSE 'WARN' 
    END AS Ticket_Assignment_Ratio,
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM Tickets t 
            LEFT JOIN AspNetUsers u ON t.CreatedById = u.Id 
            WHERE u.Id IS NULL
        )
        THEN 'PASS' ELSE 'FAIL' 
    END AS No_Orphaned_Tickets;

-- Database size and performance info
SELECT 
    DB_NAME() AS DatabaseName,
    (SELECT COUNT(*) FROM AspNetUsers) AS TotalUsers,
    (SELECT COUNT(*) FROM Tickets) AS TotalTickets,
    (SELECT COUNT(*) FROM TicketComments) AS TotalComments,
    GETDATE() AS CheckTime;

PRINT '==========================================';
PRINT 'QUICK TEST COMPLETED SUCCESSFULLY!';
PRINT 'Review the results above for system status.';
PRINT '==========================================';

-- Show connection info
SELECT 
    @@SERVERNAME AS ServerName,
    DB_NAME() AS DatabaseName,
    SYSTEM_USER AS CurrentUser,
    @@VERSION AS SQLServerVersion;
