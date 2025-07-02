using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    /// <summary>
    /// Service for managing role-based ticket access control
    /// Implements one-to-one mapping between roles and ticket categories.
    /// Each role can only see tickets in their specific category.
    /// </summary>
    public class TicketAccessService : ITicketAccessService
    {
        private readonly ILogger<TicketAccessService> _logger;
        private readonly IDepartmentRoleMappingService _departmentRoleMappingService;

        public TicketAccessService(ILogger<TicketAccessService> logger, IDepartmentRoleMappingService departmentRoleMappingService)
        {
            _logger = logger;
            _departmentRoleMappingService = departmentRoleMappingService;
        }

        /// <summary>
        /// Apply role-based filtering to a ticket query based on one-to-one role-category mapping
        /// Each role can only see tickets in their specific category (no overlap)
        /// </summary>
        public IQueryable<Ticket> ApplyAccessFilter(IQueryable<Ticket> query, string currentUserId, IList<string> userRoles)
        {
            try
            {
                _logger.LogInformation("ApplyAccessFilter - Starting filter for user: {UserId} with roles: {Roles}",
                    currentUserId, string.Join(",", userRoles));

                // Validate inputs
                if (string.IsNullOrEmpty(currentUserId))
                {
                    _logger.LogWarning("ApplyAccessFilter - Called with null or empty currentUserId");
                    return query.Where(t => false); // Return empty query for safety
                }

                if (userRoles == null || !userRoles.Any())
                {
                    _logger.LogWarning("ApplyAccessFilter called with null or empty userRoles for user: {UserId}", currentUserId);
                    return query.Where(t => t.CreatedById == currentUserId); // Default to own tickets only
                }

                // Admin and Manager can see ALL tickets
                if (userRoles.Contains("Admin") || userRoles.Contains("Manager"))
                {
                    _logger.LogInformation("Admin/Manager access - showing all tickets");
                    return query;
                }

                // Get allowed categories for user's roles
                var allowedCategories = new List<TicketCategory>();
                foreach (var role in userRoles)
                {
                    var roleCategories = _departmentRoleMappingService.GetCategoriesForRole(role);
                    allowedCategories.AddRange(roleCategories);
                }

                // Remove duplicates
                allowedCategories = allowedCategories.Distinct().ToList();

                // Build query for role-based access
                var roleBasedQuery = query.Where(t =>
                    t.CreatedById == currentUserId || // Always see tickets they created
                    allowedCategories.Contains(t.Category) // See tickets in their allowed categories
                );

                _logger.LogInformation("Role-based access filter applied for user {UserId} - allowed categories: {Categories}",
                    currentUserId, string.Join(",", allowedCategories));
                return roleBasedQuery;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in ApplyAccessFilter for user: {UserId} with roles: {Roles}",
                    currentUserId, string.Join(",", userRoles ?? new List<string>()));

                // Return safe default - only user's own tickets
                return query.Where(t => t.CreatedById == currentUserId);
            }
        }

        /// <summary>
        /// Check if a ticket category matches any of the user's roles (one-to-one mapping)
        /// </summary>
        private bool IsCategoryMatchingRole(TicketCategory category, IList<string> userRoles)
        {
            foreach (var role in userRoles)
            {
                if (_departmentRoleMappingService.CanRoleAccessCategory(role, category))
                {
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Check if a user can view a specific ticket based on one-to-one role-category mapping
        /// </summary>
        public bool CanViewTicket(Ticket ticket, string currentUserId, IList<string> userRoles)
        {
            _logger.LogInformation("CanViewTicket - TicketId: {TicketId}, CurrentUserId: {CurrentUserId}, CreatedById: {CreatedById}, UserRoles: {UserRoles}",
                ticket.Id, currentUserId, ticket.CreatedById, string.Join(",", userRoles));

            // Admin and Manager can view all tickets
            if (userRoles.Contains("Admin") || userRoles.Contains("Manager"))
            {
                _logger.LogInformation("Access granted - User has Admin or Manager role");
                return true;
            }

            // Users can always view tickets they created (regardless of their role)
            if (ticket.CreatedById == currentUserId)
            {
                _logger.LogInformation("Access granted - User created this ticket");
                return true;
            }

            // Check if user's role can access this ticket category
            if (IsCategoryMatchingRole(ticket.Category, userRoles))
            {
                _logger.LogInformation("Access granted - User role can access ticket category. TicketType: {TicketType}, Category: {Category}",
                    ticket.Type, ticket.Category);
                return true;
            }

            // Access denied
            _logger.LogInformation("Access denied - User role cannot access ticket category. TicketType: {TicketType}, Category: {Category}, UserRoles: {UserRoles}",
                ticket.Type, ticket.Category, string.Join(",", userRoles));
            return false;
        }

        /// <summary>
        /// Check if a user can update a specific ticket based on role-category mapping and assignment
        /// </summary>
        public bool CanUpdateTicket(Ticket ticket, string currentUserId, IList<string> userRoles)
        {
            // Admin and Manager can update all tickets
            if (userRoles.Contains("Admin") || userRoles.Contains("Manager"))
            {
                return true;
            }

            // Users can update tickets they created (limited fields)
            if (ticket.CreatedById == currentUserId)
            {
                return true;
            }

            // Service providers can update tickets assigned to them AND in their service category
            if (ticket.AssignedToId == currentUserId && IsCategoryMatchingRole(ticket.Category, userRoles))
            {
                return true;
            }

            // Default: no update access
            return false;
        }

        /// <summary>
        /// Check if a user can assign tickets to others
        /// </summary>
        public bool CanAssignTickets(IList<string> userRoles)
        {
            // Only Admin and Manager can assign tickets
            return userRoles.Contains("Admin") || userRoles.Contains("Manager");
        }
    }
}
