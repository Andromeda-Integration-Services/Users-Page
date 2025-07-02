using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq.Expressions;
using CAFMSystem.API.Data;
using CAFMSystem.API.Models;
using CAFMSystem.API.DTOs;
using CAFMSystem.API.Services;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<TicketsController> _logger;
        private readonly ITicketAccessService _ticketAccessService;
        private readonly IServiceDetectionService _serviceDetectionService;

        public TicketsController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<TicketsController> logger,
            ITicketAccessService ticketAccessService,
            IServiceDetectionService serviceDetectionService)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _ticketAccessService = ticketAccessService;
            _serviceDetectionService = serviceDetectionService;
        }

        /// <summary>
        /// Create a new ticket
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<TicketDto>> CreateTicket([FromBody] CreateTicketDto createTicketDto)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                _logger.LogInformation("Creating ticket for user: {UserId}", currentUserId);

                // Validate that the requested user exists
                var requestedByUser = await _userManager.FindByIdAsync(createTicketDto.RequestedByUserId);
                if (requestedByUser == null)
                {
                    return BadRequest(new { message = "Requested by user not found" });
                }

                // Determine ticket category - use provided category or auto-detect
                TicketCategory ticketCategory = TicketCategory.General; // Default

                if (createTicketDto.Category.HasValue)
                {
                    // Use category provided by frontend
                    ticketCategory = (TicketCategory)createTicketDto.Category.Value;
                    _logger.LogInformation("Using provided category: {Category}", ticketCategory);
                }
                else
                {
                    // Auto-detect category using service detection
                    var detectionText = $"{createTicketDto.Title} {createTicketDto.Description}";
                    var detectionResults = await _serviceDetectionService.AnalyzeTextAsync(detectionText);

                    if (detectionResults.Any())
                    {
                        var bestMatch = detectionResults.First();
                        ticketCategory = bestMatch.Category;
                        _logger.LogInformation("Auto-detected category: {Category} with confidence: {Confidence}%",
                            ticketCategory, bestMatch.Confidence);
                    }
                    else
                    {
                        _logger.LogInformation("No category detected, using default: {Category}", ticketCategory);
                    }
                }

                var ticket = new Ticket
                {
                    Title = createTicketDto.Title,
                    Description = createTicketDto.Description,
                    Priority = (TicketPriority)createTicketDto.Priority,
                    Type = (TicketType)createTicketDto.Type,
                    Location = createTicketDto.Location,
                    CreatedById = currentUserId, // FIXED: Always use the current logged-in user who is creating the ticket
                    OnBehalfOf = createTicketDto.OnBehalfOf, // Store the OnBehalfOf field (who the ticket is requested for)
                    Status = TicketStatus.Open,
                    Category = ticketCategory, // Use detected or provided category
                    CreatedAt = DateTime.UtcNow
                };

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Ticket created successfully with ID: {TicketId}, Category: {Category}, Title: {Title}",
                    ticket.Id, ticket.Category, ticket.Title);

                // Load the ticket with related data for response
                var createdTicket = await _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Attachments)
                    .ThenInclude(a => a.UploadedBy)
                    .FirstOrDefaultAsync(t => t.Id == ticket.Id);

                if (createdTicket == null)
                {
                    return StatusCode(500, new { message = "Error retrieving created ticket" });
                }

                // Create DTO with proper requested user mapping
                var ticketDto = MapToTicketDto(createdTicket, requestedByUser);
                return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, ticketDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating ticket");
                return StatusCode(500, new { message = "An error occurred while creating the ticket" });
            }
        }

        /// <summary>
        /// Get all tickets with optional filtering and pagination (Role-based access control)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<TicketListResponseDto>> GetTickets(
            [FromQuery] string? search = null,
            [FromQuery] int? status = null,
            [FromQuery] int? category = null,
            [FromQuery] int? priority = null,
            [FromQuery] string? assignedToUserId = null,
            [FromQuery] string? createdByUserId = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortBy = "CreatedAt",
            [FromQuery] string sortDirection = "desc")
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    _logger.LogWarning("GetTickets - No user ID found in token");
                    return Unauthorized(new { message = "Invalid token" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    _logger.LogWarning("GetTickets - User not found for ID: {UserId}", currentUserId);
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);

                _logger.LogInformation("GetTickets - Fetching tickets for user: {UserId} ({Email}) with roles: {Roles} - Search: {Search}, Status: {Status}, Page: {Page}",
                    currentUserId, currentUser.Email, string.Join(",", userRoles), search, status, pageNumber);

                var query = _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Attachments)
                        .ThenInclude(a => a.UploadedBy)
                    .AsQueryable();

                // Log total tickets before filtering
                var totalTicketsBeforeFilter = await query.CountAsync();
                _logger.LogInformation("GetTickets - Total tickets in database before filtering: {Count}", totalTicketsBeforeFilter);

                // Apply role-based access filtering using the access service
                query = _ticketAccessService.ApplyAccessFilter(query, currentUserId, userRoles);

                // Log tickets after role-based filtering
                var ticketsAfterRoleFilter = await query.CountAsync();
                _logger.LogInformation("GetTickets - Tickets after role-based filtering: {Count}", ticketsAfterRoleFilter);

                // Apply additional filters
                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(t => t.Title.Contains(search) ||
                                           t.Description.Contains(search) ||
                                           t.Location.Contains(search));
                }

                if (status.HasValue)
                {
                    query = query.Where(t => (int)t.Status == status.Value);
                }

                if (category.HasValue)
                {
                    query = query.Where(t => (int)t.Category == category.Value);
                }

                if (priority.HasValue)
                {
                    query = query.Where(t => (int)t.Priority == priority.Value);
                }

                if (!string.IsNullOrWhiteSpace(assignedToUserId))
                {
                    query = query.Where(t => t.AssignedToId == assignedToUserId);
                }

                if (!string.IsNullOrWhiteSpace(createdByUserId))
                {
                    query = query.Where(t => t.CreatedById == createdByUserId);
                }

                // Get total count before pagination
                var totalCount = await query.CountAsync();

                // Apply sorting with safe property validation
                query = ApplySafeSorting(query, sortBy, sortDirection);

                // Apply pagination
                var tickets = await query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var ticketDtos = tickets.Select(t => MapToTicketDto(t)).ToList();

                var response = new TicketListResponseDto
                {
                    Tickets = ticketDtos,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                _logger.LogInformation("Successfully fetched {Count} tickets out of {Total}",
                    ticketDtos.Count, totalCount);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching tickets");
                return StatusCode(500, new { message = "An error occurred while fetching tickets" });
            }
        }

        /// <summary>
        /// Get ticket by ID with role-based access control
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetTicketById(int id)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                _logger.LogInformation("GetTicketById - TicketId: {TicketId}, CurrentUserId: {CurrentUserId}", id, currentUserId);

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);
                _logger.LogInformation("GetTicketById - User roles: {UserRoles}", string.Join(",", userRoles));

                var ticket = await _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Comments)
                        .ThenInclude(c => c.CreatedBy)
                    .Include(t => t.Attachments)
                        .ThenInclude(a => a.UploadedBy)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (ticket == null)
                {
                    _logger.LogWarning("GetTicketById - Ticket not found: {TicketId}", id);
                    return NotFound(new { message = "Ticket not found" });
                }

                _logger.LogInformation("GetTicketById - Found ticket: {TicketId}, CreatedById: {CreatedById}, AssignedToId: {AssignedToId}",
                    ticket.Id, ticket.CreatedById, ticket.AssignedToId);

                // Check if user can view this ticket
                if (!_ticketAccessService.CanViewTicket(ticket, currentUserId, userRoles))
                {
                    _logger.LogWarning("GetTicketById - Access denied for user {CurrentUserId} to ticket {TicketId}", currentUserId, id);
                    return StatusCode(403, new { message = "You don't have permission to view this ticket" });
                }

                _logger.LogInformation("GetTicketById - Access granted for user {CurrentUserId} to ticket {TicketId}", currentUserId, id);
                var ticketDto = MapToTicketDto(ticket);
                return Ok(ticketDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving ticket with ID: {TicketId}", id);
                return StatusCode(500, new { message = "An error occurred while retrieving the ticket" });
            }
        }

        /// <summary>
        /// Update an existing ticket with role-based access control
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<TicketDto>> UpdateTicket(int id, [FromBody] UpdateTicketDto updateTicketDto)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);

                var ticket = await _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Attachments)
                    .ThenInclude(a => a.UploadedBy)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (ticket == null)
                {
                    return NotFound(new { message = "Ticket not found" });
                }

                // Check if user can update this ticket
                if (!_ticketAccessService.CanUpdateTicket(ticket, currentUserId, userRoles))
                {
                    return StatusCode(403, new { message = "You don't have permission to update this ticket" });
                }

                // Validate assignment permissions
                if (!string.IsNullOrEmpty(updateTicketDto.AssignedToUserId) &&
                    updateTicketDto.AssignedToUserId != ticket.AssignedToId)
                {
                    if (!_ticketAccessService.CanAssignTickets(userRoles))
                    {
                        return StatusCode(403, new { message = "You don't have permission to assign tickets" });
                    }

                    // Validate that the assigned user exists
                    var assignedUser = await _userManager.FindByIdAsync(updateTicketDto.AssignedToUserId);
                    if (assignedUser == null)
                    {
                        return BadRequest(new { message = "Assigned user not found" });
                    }
                }

                // Update ticket fields based on user permissions
                if (!string.IsNullOrEmpty(updateTicketDto.Title))
                    ticket.Title = updateTicketDto.Title;

                if (!string.IsNullOrEmpty(updateTicketDto.Description))
                    ticket.Description = updateTicketDto.Description;

                if (!string.IsNullOrEmpty(updateTicketDto.Location))
                    ticket.Location = updateTicketDto.Location;

                if (updateTicketDto.Priority.HasValue)
                    ticket.Priority = (TicketPriority)updateTicketDto.Priority.Value;

                if (updateTicketDto.Status.HasValue)
                    ticket.Status = (TicketStatus)updateTicketDto.Status.Value;

                if (updateTicketDto.Category.HasValue)
                    ticket.Category = (TicketCategory)updateTicketDto.Category.Value;

                if (!string.IsNullOrEmpty(updateTicketDto.AssignedToUserId))
                    ticket.AssignedToId = updateTicketDto.AssignedToUserId;

                ticket.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Ticket {TicketId} updated successfully by user {UserId}", id, currentUserId);

                // Return updated ticket with related data
                var updatedTicket = await _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .Include(t => t.Attachments)
                    .ThenInclude(a => a.UploadedBy)
                    .FirstOrDefaultAsync(t => t.Id == id);

                var ticketDto = MapToTicketDto(updatedTicket!);
                return Ok(ticketDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ticket with ID: {TicketId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the ticket" });
            }
        }

        /// <summary>
        /// Get next ticket ID for auto-generation
        /// </summary>
        [HttpGet("next-id")]
        public async Task<ActionResult<object>> GetNextTicketId()
        {
            try
            {
                var lastTicket = await _context.Tickets
                    .OrderByDescending(t => t.Id)
                    .FirstOrDefaultAsync();

                var nextId = (lastTicket?.Id ?? 0) + 1;

                return Ok(new { nextId });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting next ticket ID");
                return StatusCode(500, new { message = "An error occurred while getting next ticket ID" });
            }
        }

        /// <summary>
        /// Get ticket statistics for dashboard (Role-based access control)
        /// </summary>
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetTicketStats()
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);
                _logger.LogInformation("GetTicketStats - Fetching ticket statistics for user: {UserId} ({Email}) with roles: {Roles}",
                    currentUserId, currentUser.Email, string.Join(",", userRoles));

                // Apply role-based filtering to tickets
                var query = _context.Tickets.AsQueryable();
                var totalTicketsBeforeFilter = await query.CountAsync();
                _logger.LogInformation("GetTicketStats - Total tickets in database before filtering: {Count}", totalTicketsBeforeFilter);

                query = _ticketAccessService.ApplyAccessFilter(query, currentUserId, userRoles);
                var allTickets = await query.ToListAsync();

                _logger.LogInformation("GetTicketStats - Tickets after role-based filtering: {Count}", allTickets.Count);

                // Calculate basic statistics
                var totalTickets = allTickets.Count;
                var openTickets = allTickets.Count(t => t.Status == TicketStatus.Open);
                var inProgressTickets = allTickets.Count(t => t.Status == TicketStatus.InProgress);
                var completedTickets = allTickets.Count(t => t.Status == TicketStatus.Resolved || t.Status == TicketStatus.Closed);
                var closedTickets = allTickets.Count(t => t.Status == TicketStatus.Closed);
                var criticalTickets = allTickets.Count(t => t.Priority == TicketPriority.Critical || t.Priority == TicketPriority.Emergency);

                // Calculate tickets by category
                var ticketsByCategory = allTickets
                    .GroupBy(t => t.Category)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Count()
                    );

                // Calculate tickets by status
                var ticketsByStatus = allTickets
                    .GroupBy(t => t.Status)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Count()
                    );

                // Calculate tickets by priority
                var ticketsByPriority = allTickets
                    .GroupBy(t => t.Priority)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Count()
                    );

                // Calculate ticket trends (last 7 days)
                var ticketTrends = new List<object>();
                for (int i = 6; i >= 0; i--)
                {
                    var date = DateTime.UtcNow.AddDays(-i).Date;
                    var dayTickets = allTickets.Where(t => t.CreatedAt.Date == date);

                    ticketTrends.Add(new
                    {
                        date = date.ToString("yyyy-MM-dd"),
                        created = dayTickets.Count(),
                        completed = dayTickets.Count(t => t.Status == TicketStatus.Resolved || t.Status == TicketStatus.Closed),
                        inProgress = dayTickets.Count(t => t.Status == TicketStatus.InProgress)
                    });
                }

                var stats = new
                {
                    totalTickets,
                    openTickets,
                    inProgressTickets,
                    completedTickets,
                    closedTickets,
                    criticalTickets,
                    ticketsByCategory,
                    ticketsByStatus,
                    ticketsByPriority,
                    ticketTrends
                };

                _logger.LogInformation("Successfully calculated ticket statistics - Total: {Total}, Open: {Open}, InProgress: {InProgress}, Completed: {Completed}",
                    totalTickets, openTickets, inProgressTickets, completedTickets);

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating ticket statistics");
                return StatusCode(500, new { message = "An error occurred while calculating ticket statistics" });
            }
        }

        /// <summary>
        /// Get department performance statistics (Role-based access control)
        /// </summary>
        [HttpGet("department-stats")]
        public async Task<ActionResult<object>> GetDepartmentStats()
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);
                _logger.LogInformation("Fetching department statistics for user: {UserId} with roles: {Roles}", currentUserId, string.Join(",", userRoles));

                // Apply role-based filtering to tickets
                var query = _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .AsQueryable();
                query = _ticketAccessService.ApplyAccessFilter(query, currentUserId, userRoles);
                var ticketsWithUsers = await query.ToListAsync();

                // Get all users to calculate department stats
                var allUsers = await _context.Users.ToListAsync();

                // Group tickets by department (based on assigned user's department)
                var departmentStats = allUsers
                    .Where(u => !string.IsNullOrEmpty(u.Department))
                    .GroupBy(u => u.Department)
                    .Select(g => new
                    {
                        department = g.Key,
                        totalTickets = ticketsWithUsers.Count(t => t.AssignedTo?.Department == g.Key),
                        completedTickets = ticketsWithUsers.Count(t => t.AssignedTo?.Department == g.Key &&
                            (t.Status == TicketStatus.Resolved || t.Status == TicketStatus.Closed)),
                        activeTickets = ticketsWithUsers.Count(t => t.AssignedTo?.Department == g.Key &&
                            (t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress)),
                        avgResolutionTime = CalculateAvgResolutionTime(ticketsWithUsers
                            .Where(t => t.AssignedTo?.Department == g.Key && t.CompletedAt.HasValue)),
                        efficiency = CalculateEfficiency(ticketsWithUsers
                            .Where(t => t.AssignedTo?.Department == g.Key))
                    })
                    .Where(d => d.totalTickets > 0) // Only include departments with tickets
                    .ToList();

                return Ok(departmentStats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating department statistics");
                return StatusCode(500, new { message = "An error occurred while calculating department statistics" });
            }
        }

        /// <summary>
        /// Get live system metrics (Role-based access control)
        /// </summary>
        [HttpGet("live-metrics")]
        public async Task<ActionResult<object>> GetLiveMetrics()
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);
                _logger.LogInformation("Fetching live metrics for user: {UserId} with roles: {Roles}", currentUserId, string.Join(",", userRoles));

                var today = DateTime.UtcNow.Date;

                // Apply role-based filtering to tickets
                var query = _context.Tickets.AsQueryable();
                query = _ticketAccessService.ApplyAccessFilter(query, currentUserId, userRoles);
                var allTickets = await query.ToListAsync();
                var allUsers = await _context.Users.ToListAsync();

                // Calculate live metrics
                var liveMetrics = new
                {
                    activeUsers = allUsers.Count(u => u.IsActive && u.LastLoginAt.HasValue &&
                        u.LastLoginAt.Value > DateTime.UtcNow.AddDays(-7)), // Active in last 7 days
                    ticketsCreatedToday = allTickets.Count(t => t.CreatedAt.Date == today),
                    ticketsCompletedToday = allTickets.Count(t => t.CompletedAt.HasValue &&
                        t.CompletedAt.Value.Date == today),
                    avgResponseTime = CalculateAvgResponseTime(allTickets),
                    systemLoad = CalculateSystemLoad(allTickets)
                };

                return Ok(liveMetrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating live metrics");
                return StatusCode(500, new { message = "An error occurred while calculating live metrics" });
            }
        }

        /// <summary>
        /// Get recent ticket activity history (Role-based access control)
        /// </summary>
        [HttpGet("activity-history")]
        public async Task<ActionResult<object>> GetActivityHistory([FromQuery] int limit = 20)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                if (currentUser == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var userRoles = await _userManager.GetRolesAsync(currentUser);
                _logger.LogInformation("Fetching ticket activity history for user: {UserId} with roles: {Roles}", currentUserId, string.Join(",", userRoles));

                // Apply role-based filtering to tickets
                var query = _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .AsQueryable();
                query = _ticketAccessService.ApplyAccessFilter(query, currentUserId, userRoles);
                var recentTickets = await query
                    .OrderByDescending(t => t.CreatedAt)
                    .Take(limit)
                    .ToListAsync();

                // Create activity history entries
                var activityHistory = recentTickets.Select(t => new
                {
                    id = t.Id,
                    ticketId = t.Id,
                    ticketTitle = t.Title,
                    fromStatus = "New",
                    toStatus = t.Status.ToString(),
                    fromUser = t.CreatedBy.FirstName + " " + t.CreatedBy.LastName,
                    toUser = t.AssignedTo != null ? t.AssignedTo.FirstName + " " + t.AssignedTo.LastName : "Unassigned",
                    department = t.AssignedTo?.Department ?? t.CreatedBy.Department ?? "General",
                    timestamp = t.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    duration = CalculateDuration(t.CreatedAt, t.CompletedAt),
                    action = GetActionFromStatus(t.Status)
                }).ToList();

                return Ok(activityHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching activity history");
                return StatusCode(500, new { message = "An error occurred while fetching activity history" });
            }
        }

        // Helper methods for calculations
        private static int CalculateAvgResolutionTime(IEnumerable<Ticket> completedTickets)
        {
            var tickets = completedTickets.ToList();
            if (!tickets.Any()) return 0;

            var totalHours = tickets
                .Where(t => t.CompletedAt.HasValue)
                .Sum(t => (t.CompletedAt!.Value - t.CreatedAt).TotalHours);

            return (int)(totalHours / tickets.Count);
        }

        private static int CalculateEfficiency(IEnumerable<Ticket> departmentTickets)
        {
            var tickets = departmentTickets.ToList();
            if (!tickets.Any()) return 0;

            var completedCount = tickets.Count(t => t.Status == TicketStatus.Resolved || t.Status == TicketStatus.Closed);
            return (int)((double)completedCount / tickets.Count * 100);
        }

        private static int CalculateAvgResponseTime(IEnumerable<Ticket> tickets)
        {
            var ticketList = tickets.ToList();
            if (!ticketList.Any()) return 0;

            // Calculate average time from creation to assignment (in minutes)
            var assignedTickets = ticketList.Where(t => t.AssignedToId != null).ToList();
            if (!assignedTickets.Any()) return 0;

            // For now, return a calculated value based on ticket age
            var avgHours = assignedTickets.Average(t => (DateTime.UtcNow - t.CreatedAt).TotalHours);
            return Math.Min((int)(avgHours * 60), 240); // Cap at 4 hours (240 minutes)
        }

        private static int CalculateSystemLoad(IEnumerable<Ticket> tickets)
        {
            var ticketList = tickets.ToList();
            var openTickets = ticketList.Count(t => t.Status == TicketStatus.Open || t.Status == TicketStatus.InProgress);
            var totalTickets = ticketList.Count;

            if (totalTickets == 0) return 20; // Default low load

            var loadPercentage = (double)openTickets / Math.Max(totalTickets, 10) * 100;
            return Math.Min((int)loadPercentage + 20, 100); // Add base load and cap at 100%
        }

        private static string CalculateDuration(DateTime createdAt, DateTime? completedAt)
        {
            var endTime = completedAt ?? DateTime.UtcNow;
            var duration = endTime - createdAt;

            if (duration.TotalDays >= 1)
            {
                return $"{(int)duration.TotalDays}d {duration.Hours}h";
            }
            else
            {
                return $"{(int)duration.TotalHours}h {duration.Minutes}m";
            }
        }

        private static string GetActionFromStatus(TicketStatus status)
        {
            return status switch
            {
                TicketStatus.Open => "Created",
                TicketStatus.InProgress => "In Progress",
                TicketStatus.OnHold => "On Hold",
                TicketStatus.Resolved => "Resolved",
                TicketStatus.Closed => "Closed",
                TicketStatus.Cancelled => "Cancelled",
                _ => "Unknown"
            };
        }



        /// <summary>
        /// Map Ticket entity to TicketDto
        /// </summary>
        private static TicketDto MapToTicketDto(Ticket ticket)
        {
            return MapToTicketDto(ticket, null);
        }

        /// <summary>
        /// Map Ticket entity to TicketDto with optional requested user information
        /// </summary>
        private static TicketDto MapToTicketDto(Ticket ticket, ApplicationUser? requestedByUser)
        {
            return new TicketDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Location = ticket.Location,
                Priority = (int)ticket.Priority,
                PriorityText = ticket.Priority.ToString(),
                Status = (int)ticket.Status,
                StatusText = ticket.Status.ToString(),
                Category = (int)ticket.Category,
                CategoryText = ticket.Category.ToString(),
                Type = (int)ticket.Type,
                TypeText = ticket.Type.ToString(),
                CreatedAt = ticket.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                IsOverdue = ticket.DueDate.HasValue && ticket.DueDate < DateTime.UtcNow && ticket.Status != TicketStatus.Closed,
                CreatedByUserId = ticket.CreatedById,
                CreatedByUserName = ticket.CreatedBy?.FullName ?? "Unknown",
                CreatedByUserEmail = ticket.CreatedBy?.Email ?? "Unknown",
                // FIXED: Use the actual requested user information if provided
                RequestedByUserId = requestedByUser?.Id ?? ticket.CreatedById,
                RequestedByUserName = requestedByUser?.FullName ?? ticket.CreatedBy?.FullName ?? "Unknown",
                RequestedByUserEmail = requestedByUser?.Email ?? ticket.CreatedBy?.Email ?? "Unknown",
                OnBehalfOf = ticket.OnBehalfOf, // Use the stored OnBehalfOf field from database
                AssignedToUserId = ticket.AssignedToId,
                AssignedToUserName = ticket.AssignedTo?.FullName,
                AssignedToUserEmail = ticket.AssignedTo?.Email,
                CompletedAt = ticket.CompletedAt?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                DueDate = ticket.DueDate?.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                Attachments = ticket.Attachments?.Select(a => new TicketAttachmentDto
                {
                    Id = a.Id,
                    TicketId = a.TicketId,
                    FileName = a.FileName,
                    OriginalFileName = a.OriginalFileName,
                    ContentType = a.ContentType,
                    FileSize = a.FileSize,
                    FileSizeFormatted = FormatFileSize(a.FileSize),
                    UploadedAt = a.UploadedAt,
                    UploadedById = a.UploadedById,
                    UploadedByName = a.UploadedBy != null ? $"{a.UploadedBy.FirstName} {a.UploadedBy.LastName}" : "Unknown",
                    IsImage = IsImageContentType(a.ContentType),
                    FileIcon = GetFileIcon(a.ContentType)
                }).ToList() ?? new List<TicketAttachmentDto>()
            };
        }

        /// <summary>
        /// NEW ENDPOINT: Get intelligent service type suggestions based on input text
        /// This is a completely new endpoint that doesn't affect existing functionality
        /// </summary>
        [HttpGet("suggestions")]
        public async Task<ActionResult<List<ServiceSuggestionDto>>> GetServiceSuggestions([FromQuery] string input)
        {
            try
            {
                _logger.LogInformation("Getting service suggestions for input: {InputLength} characters", input?.Length ?? 0);

                if (string.IsNullOrWhiteSpace(input) || input.Length < 3)
                {
                    return Ok(new List<ServiceSuggestionDto>());
                }

                // Use the new service detection service
                var detectionResults = await _serviceDetectionService.AnalyzeTextAsync(input);

                // Convert to DTOs compatible with existing frontend interface
                var suggestions = detectionResults.Select(result => new ServiceSuggestionDto
                {
                    Keyword = string.Join(", ", result.MatchedKeywords.Take(3)), // Show top 3 keywords
                    Category = (int)result.Category,
                    CategoryText = result.CategoryText,
                    Relevance = result.Confidence / 100.0 // Convert to 0-1 scale for compatibility
                }).ToList();

                _logger.LogInformation("Returning {Count} service suggestions", suggestions.Count);
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting service suggestions");
                // Graceful fallback - return empty list instead of error to maintain existing functionality
                return Ok(new List<ServiceSuggestionDto>());
            }
        }
        /// <summary>
        /// Apply safe sorting to prevent EF.Property errors with invalid property names
        /// </summary>
        private static IQueryable<Ticket> ApplySafeSorting(IQueryable<Ticket> query, string sortBy, string sortDirection)
        {
            // Define allowed sort properties to prevent injection attacks and invalid property errors
            var allowedSortProperties = new Dictionary<string, Expression<Func<Ticket, object>>>(StringComparer.OrdinalIgnoreCase)
            {
                { "Id", t => t.Id },
                { "Title", t => t.Title },
                { "Description", t => t.Description },
                { "Location", t => t.Location },
                { "Priority", t => (int)t.Priority },
                { "Status", t => (int)t.Status },
                { "Category", t => (int)t.Category },
                { "Type", t => (int)t.Type },
                { "CreatedAt", t => t.CreatedAt },
                { "UpdatedAt", t => t.UpdatedAt ?? DateTime.MinValue },
                { "CompletedAt", t => t.CompletedAt ?? DateTime.MinValue },
                { "DueDate", t => t.DueDate ?? DateTime.MinValue }
            };

            // Default to CreatedAt if sortBy is invalid
            if (!allowedSortProperties.ContainsKey(sortBy))
            {
                sortBy = "CreatedAt";
            }

            var sortExpression = allowedSortProperties[sortBy];

            return string.Equals(sortDirection, "asc", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(sortExpression)
                : query.OrderByDescending(sortExpression);
        }

        /// <summary>
        /// Helper methods for file attachment handling
        /// </summary>
        private static string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        private static bool IsImageContentType(string contentType)
        {
            return contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }

        private static string GetFileIcon(string contentType)
        {
            return contentType.ToLowerInvariant() switch
            {
                var ct when ct.StartsWith("image/") => "fa-image",
                "application/pdf" => "fa-file-pdf",
                var ct when ct.Contains("word") => "fa-file-word",
                var ct when ct.Contains("excel") || ct.Contains("spreadsheet") => "fa-file-excel",
                var ct when ct.Contains("powerpoint") || ct.Contains("presentation") => "fa-file-powerpoint",
                "text/plain" => "fa-file-text",
                "text/csv" => "fa-file-csv",
                var ct when ct.Contains("zip") || ct.Contains("rar") => "fa-file-archive",
                _ => "fa-file"
            };
        }
    }

    /// <summary>
    /// DTO for service suggestions - compatible with existing frontend interface
    /// </summary>
    public class ServiceSuggestionDto
    {
        public string Keyword { get; set; } = string.Empty;
        public int Category { get; set; }
        public string CategoryText { get; set; } = string.Empty;
        public double Relevance { get; set; }
    }
}
