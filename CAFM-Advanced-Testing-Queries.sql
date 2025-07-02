-- =============================================
-- SERVICE PROVIDER PERFORMANCE METRICS
-- =============================================
SELECT 
    assigned.FirstName + ' ' + assigned.LastName AS ServiceProvider,
    assigned.Email,
    assigned.Department,
    
    -- Get their role
    (SELECT STRING_AGG(r.Name, ', ') 
     FROM AspNetUserRoles ur 
     JOIN AspNetRoles r ON ur.RoleId = r.Id 
     WHERE ur.UserId = assigned.Id) AS Role,
    
    -- Ticket counts
    COUNT(*) AS TotalAssignedTickets,
    SUM(CASE WHEN t.Status = 4 OR t.Status = 5 THEN 1 ELSE 0 END) AS CompletedTickets,
    SUM(CASE WHEN t.Status = 1 OR t.Status = 2 THEN 1 ELSE 0 END) AS ActiveTickets,
    
    -- Performance metrics
    CASE 
        WHEN COUNT(*) > 0 THEN 
            ROUND((SUM(CASE WHEN t.Status = 4 OR t.Status = 5 THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 2)
        ELSE 0 
    END AS CompletionRate,
    
    -- Average resolution time (in hours)
    CASE 
        WHEN SUM(CASE WHEN t.CompletedAt IS NOT NULL THEN 1 ELSE 0 END) > 0 THEN
            AVG(CASE WHEN t.CompletedAt IS NOT NULL THEN DATEDIFF(HOUR, t.CreatedAt, t.CompletedAt) ELSE NULL END)
        ELSE NULL
    END AS AvgResolutionHours,
    
    -- Category breakdown
    STRING_AGG(
        CASE t.Category
            WHEN 2 THEN 'Plumbing'
            WHEN 3 THEN 'Electrical'
            WHEN 4 THEN 'HVAC'
            WHEN 5 THEN 'Cleaning'
            WHEN 8 THEN 'Maintenance'
            ELSE 'Other'
        END, ', '
    ) AS ServiceCategories

FROM Tickets t
INNER JOIN AspNetUsers assigned ON t.AssignedToId = assigned.Id
GROUP BY assigned.Id, assigned.FirstName, assigned.LastName, assigned.Email, assigned.Department
ORDER BY CompletionRate DESC, TotalAssignedTickets DESC;