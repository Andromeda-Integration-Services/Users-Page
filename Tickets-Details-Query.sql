-- =====================================================
-- COMPREHENSIVE TICKETS QUERY FOR SSMS
-- Shows: ID, Title, Description, Priority, Status, 
--        OnBehalfOf, RequestedBy (CreatedBy), AssignedTo
-- =====================================================

USE CAFMSystem;

SELECT 
    -- Basic Ticket Info
    t.Id AS [Ticket ID],
    t.Title,
    LEFT(t.Description, 100) + CASE 
        WHEN LEN(t.Description) > 100 THEN '...' 
        ELSE '' 
    END AS [Description (Preview)],
    
    -- Priority & Status
    CASE t.Priority
        WHEN 1 THEN 'Low'
        WHEN 2 THEN 'Medium' 
        WHEN 3 THEN 'High'
        WHEN 4 THEN 'Critical'
        WHEN 5 THEN 'Emergency'
        ELSE 'Unknown'
    END AS Priority,
    
    CASE t.Status
        WHEN 1 THEN 'Open'
        WHEN 2 THEN 'In Progress'
        WHEN 3 THEN 'On Hold'
        WHEN 4 THEN 'Resolved'
        WHEN 5 THEN 'Closed'
        WHEN 6 THEN 'Cancelled'
        ELSE 'Unknown'
    END AS Status,
    
    -- Location
    t.Location,
    
    -- On Behalf Of (The field we're debugging)
    CASE 
        WHEN t.OnBehalfOf IS NULL OR t.OnBehalfOf = '' THEN 'Direct Request'
        ELSE t.OnBehalfOf
    END AS [On Behalf Of],
    
    -- Requested By (CreatedBy User)
    COALESCE(createdBy.FullName, createdBy.UserName, 'Unknown User') AS [Requested By],
    createdBy.Email AS [Requested By Email],
    
    -- Assigned To
    CASE 
        WHEN assignedTo.FullName IS NOT NULL THEN assignedTo.FullName
        WHEN assignedTo.UserName IS NOT NULL THEN assignedTo.UserName
        ELSE 'Unassigned'
    END AS [Assigned To],
    assignedTo.Email AS [Assigned To Email],
    
    -- Dates
    t.CreatedAt AS [Created Date],
    t.UpdatedAt AS [Updated Date],
    t.CompletedAt AS [Completed Date],
    
    -- Additional Info
    CASE t.Category
        WHEN 1 THEN 'General'
        WHEN 2 THEN 'Maintenance'
        WHEN 3 THEN 'Cleaning'
        WHEN 4 THEN 'Security'
        WHEN 5 THEN 'IT Support'
        ELSE 'Other'
    END AS Category

FROM Tickets t
    LEFT JOIN AspNetUsers createdBy ON t.CreatedById = createdBy.Id
    LEFT JOIN AspNetUsers assignedTo ON t.AssignedToId = assignedTo.Id

ORDER BY t.CreatedAt DESC;

-- =====================================================
-- SEPARATE QUERY: Check OnBehalfOf Field Status
-- =====================================================

SELECT 
    'OnBehalfOf Field Analysis' AS [Analysis],
    COUNT(*) AS [Total Tickets],
    COUNT(t.OnBehalfOf) AS [Tickets with OnBehalfOf],
    COUNT(*) - COUNT(t.OnBehalfOf) AS [Tickets without OnBehalfOf],
    CAST(COUNT(t.OnBehalfOf) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS [Percentage with OnBehalfOf]
FROM Tickets t;

-- =====================================================
-- SEPARATE QUERY: Recent Tickets with OnBehalfOf Details
-- =====================================================

SELECT TOP 10
    t.Id,
    t.Title,
    t.OnBehalfOf,
    CASE 
        WHEN t.OnBehalfOf IS NULL THEN 'NULL'
        WHEN t.OnBehalfOf = '' THEN 'EMPTY STRING'
        ELSE 'HAS VALUE: ' + t.OnBehalfOf
    END AS [OnBehalfOf Status],
    createdBy.FullName AS [Created By],
    t.CreatedAt
FROM Tickets t
    LEFT JOIN AspNetUsers createdBy ON t.CreatedById = createdBy.Id
ORDER BY t.CreatedAt DESC;
