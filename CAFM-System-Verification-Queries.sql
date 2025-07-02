-- =====================================================
-- CAFM System Verification Queries for SSMS
-- Execute these queries to verify system data and status
-- =====================================================

-- 1. USERS AND ROLES OVERVIEW
-- =====================================================
PRINT '=== 1. USERS AND ROLES OVERVIEW ==='
SELECT 
    u.Id,
    u.Email,
    u.FirstName + ' ' + u.LastName AS FullName,
    u.Department,
    u.EmployeeId,
    u.IsActive,
    u.EmailConfirmed,
    u.CreatedAt,
    u.LastLoginAt,
    STRING_AGG(r.Name, ', ') AS Roles
FROM AspNetUsers u
LEFT JOIN AspNetUserRoles ur ON u.Id = ur.UserId
LEFT JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE u.IsActive = 1
GROUP BY u.Id, u.Email, u.FirstName, u.LastName, u.Department, u.EmployeeId, u.IsActive, u.EmailConfirmed, u.CreatedAt, u.LastLoginAt
ORDER BY u.CreatedAt DESC;

-- 2. USER LOGIN HISTORY AND ACTIVITY
-- =====================================================
PRINT '=== 2. USER LOGIN HISTORY AND ACTIVITY ==='
SELECT 
    u.Email,
    u.FirstName + ' ' + u.LastName AS FullName,
    STRING_AGG(r.Name, ', ') AS Roles,
    u.LastLoginAt,
    CASE 
        WHEN u.LastLoginAt IS NULL THEN 'Never logged in'
        WHEN u.LastLoginAt > DATEADD(day, -1, GETUTCDATE()) THEN 'Active (Last 24h)'
        WHEN u.LastLoginAt > DATEADD(day, -7, GETUTCDATE()) THEN 'Recent (Last week)'
        WHEN u.LastLoginAt > DATEADD(day, -30, GETUTCDATE()) THEN 'Inactive (Last month)'
        ELSE 'Very inactive (>30 days)'
    END AS ActivityStatus,
    u.CreatedAt AS AccountCreated,
    DATEDIFF(day, u.CreatedAt, GETUTCDATE()) AS AccountAgeDays
FROM AspNetUsers u
LEFT JOIN AspNetUserRoles ur ON u.Id = ur.UserId
LEFT JOIN AspNetRoles r ON ur.RoleId = r.Id
WHERE u.IsActive = 1
GROUP BY u.Id, u.Email, u.FirstName, u.LastName, u.LastLoginAt, u.CreatedAt
ORDER BY u.LastLoginAt DESC NULLS LAST;

-- 3. TICKETS OVERVIEW BY STATUS
-- =====================================================
PRINT '=== 3. TICKETS OVERVIEW BY STATUS ==='
SELECT 
    Status,
    CASE Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'InProgress'
        WHEN 3 THEN 'OnHold'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Closed'
        WHEN 6 THEN 'Cancelled'
        ELSE 'Unknown'
    END AS StatusText,
    COUNT(*) AS TicketCount,
    CAST(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Tickets) AS DECIMAL(5,2)) AS Percentage
FROM Tickets
GROUP BY Status
ORDER BY Status;

-- 4. TICKETS BY CATEGORY AND TYPE
-- =====================================================
PRINT '=== 4. TICKETS BY CATEGORY AND TYPE ==='
SELECT 
    Category,
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
        ELSE 'Unknown'
    END AS CategoryText,
    Type,
    CASE Type
        WHEN 1 THEN 'Material'
        WHEN 2 THEN 'Service'
        ELSE 'Unknown'
    END AS TypeText,
    COUNT(*) AS TicketCount
FROM Tickets
GROUP BY Category, Type
ORDER BY Category, Type;

-- 5. RECENT TICKETS WITH FULL DETAILS
-- =====================================================
PRINT '=== 5. RECENT TICKETS WITH FULL DETAILS ==='
SELECT TOP 20
    t.Id,
    t.Title,
    t.Description,
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
    CASE t.Type
        WHEN 1 THEN 'Material'
        WHEN 2 THEN 'Service'
        ELSE 'Unknown'
    END AS Type,
    t.Location,
    cb.FirstName + ' ' + cb.LastName AS CreatedBy,
    cb.Email AS CreatedByEmail,
    ab.FirstName + ' ' + ab.LastName AS AssignedTo,
    ab.Email AS AssignedToEmail,
    t.CreatedAt,
    t.UpdatedAt,
    t.CompletedAt
FROM Tickets t
LEFT JOIN AspNetUsers cb ON t.CreatedById = cb.Id
LEFT JOIN AspNetUsers ab ON t.AssignedToId = ab.Id
ORDER BY t.CreatedAt DESC;

-- 6. SERVICE PROVIDER WORKLOAD ANALYSIS
-- =====================================================
PRINT '=== 6. SERVICE PROVIDER WORKLOAD ANALYSIS ==='
SELECT 
    u.FirstName + ' ' + u.LastName AS ServiceProvider,
    u.Email,
    u.Department,
    STRING_AGG(r.Name, ', ') AS Roles,
    COUNT(t.Id) AS AssignedTickets,
    SUM(CASE WHEN t.Status IN (1, 2, 3) THEN 1 ELSE 0 END) AS ActiveTickets,
    SUM(CASE WHEN t.Status IN (4, 5) THEN 1 ELSE 0 END) AS CompletedTickets,
    SUM(CASE WHEN t.Priority >= 4 THEN 1 ELSE 0 END) AS HighPriorityTickets
FROM AspNetUsers u
INNER JOIN AspNetUserRoles ur ON u.Id = ur.UserId
INNER JOIN AspNetRoles r ON ur.RoleId = r.Id
LEFT JOIN Tickets t ON u.Id = t.AssignedToId
WHERE r.Name IN ('Plumber', 'Electrician', 'Cleaner')
    AND u.IsActive = 1
GROUP BY u.Id, u.FirstName, u.LastName, u.Email, u.Department
ORDER BY AssignedTickets DESC;

-- 7. TICKETS REQUIRING ATTENTION
-- =====================================================
PRINT '=== 7. TICKETS REQUIRING ATTENTION ==='
SELECT 
    t.Id,
    t.Title,
    CASE t.Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'InProgress'
        WHEN 3 THEN 'OnHold'
        ELSE 'Other'
    END AS Status,
    CASE t.Priority
        WHEN 1 THEN 'Low'
        WHEN 2 THEN 'Medium'
        WHEN 3 THEN 'High'
        WHEN 4 THEN 'Critical'
        WHEN 5 THEN 'Emergency'
    END AS Priority,
    CASE t.Category
        WHEN 2 THEN 'Plumbing'
        WHEN 3 THEN 'Electrical'
        WHEN 4 THEN 'HVAC'
        WHEN 5 THEN 'Cleaning'
        WHEN 8 THEN 'Maintenance'
        ELSE 'Other'
    END AS Category,
    t.Location,
    ISNULL(ab.FirstName + ' ' + ab.LastName, 'UNASSIGNED') AS AssignedTo,
    cb.FirstName + ' ' + cb.LastName AS CreatedBy,
    t.CreatedAt,
    DATEDIFF(hour, t.CreatedAt, GETUTCDATE()) AS HoursOld,
    CASE 
        WHEN t.AssignedToId IS NULL THEN 'Needs Assignment'
        WHEN t.Priority >= 4 AND DATEDIFF(hour, t.CreatedAt, GETUTCDATE()) > 4 THEN 'Critical - Overdue'
        WHEN t.Priority = 3 AND DATEDIFF(hour, t.CreatedAt, GETUTCDATE()) > 24 THEN 'High Priority - Overdue'
        WHEN DATEDIFF(day, t.CreatedAt, GETUTCDATE()) > 7 THEN 'Long Outstanding'
        ELSE 'Normal'
    END AS AttentionReason
FROM Tickets t
LEFT JOIN AspNetUsers cb ON t.CreatedById = cb.Id
LEFT JOIN AspNetUsers ab ON t.AssignedToId = ab.Id
WHERE t.Status IN (1, 2, 3) -- Open, InProgress, OnHold
    AND (
        t.AssignedToId IS NULL OR 
        (t.Priority >= 4 AND DATEDIFF(hour, t.CreatedAt, GETUTCDATE()) > 4) OR
        (t.Priority = 3 AND DATEDIFF(hour, t.CreatedAt, GETUTCDATE()) > 24) OR
        DATEDIFF(day, t.CreatedAt, GETUTCDATE()) > 7
    )
ORDER BY t.Priority DESC, t.CreatedAt ASC;

-- 8. SYSTEM HEALTH CHECK
-- =====================================================
PRINT '=== 8. SYSTEM HEALTH CHECK ==='
SELECT 
    'Total Users' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM AspNetUsers WHERE IsActive = 1
UNION ALL
SELECT 
    'Active Users (Last 7 days)' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM AspNetUsers 
WHERE IsActive = 1 AND LastLoginAt > DATEADD(day, -7, GETUTCDATE())
UNION ALL
SELECT 
    'Total Tickets' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM Tickets
UNION ALL
SELECT 
    'Open Tickets' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM Tickets WHERE Status = 1
UNION ALL
SELECT 
    'Unassigned Tickets' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM Tickets WHERE AssignedToId IS NULL AND Status IN (1, 2, 3)
UNION ALL
SELECT 
    'Critical/Emergency Tickets' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM Tickets WHERE Priority >= 4 AND Status IN (1, 2, 3)
UNION ALL
SELECT 
    'Tickets Created Today' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM Tickets WHERE CAST(CreatedAt AS DATE) = CAST(GETUTCDATE() AS DATE)
UNION ALL
SELECT 
    'Tickets Completed Today' AS Metric,
    CAST(COUNT(*) AS VARCHAR(20)) AS Value
FROM Tickets WHERE CAST(CompletedAt AS DATE) = CAST(GETUTCDATE() AS DATE);

PRINT '=== VERIFICATION QUERIES COMPLETED ==='
