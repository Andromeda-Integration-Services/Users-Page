using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    /// <summary>
    /// Service for mapping departments to roles and ticket categories
    /// Implements one-to-one mapping between departments and ticket categories
    /// </summary>
    public class DepartmentRoleMappingService : IDepartmentRoleMappingService
    {
        private readonly ILogger<DepartmentRoleMappingService> _logger;

        public DepartmentRoleMappingService(ILogger<DepartmentRoleMappingService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get the appropriate role based on department
        /// </summary>
        public string GetRoleForDepartment(string department)
        {
            if (string.IsNullOrWhiteSpace(department))
            {
                _logger.LogWarning("Department is null or empty, defaulting to EndUser role");
                return "EndUser";
            }

            var role = department.ToLower().Trim() switch
            {
                "administration" => "Admin",
                "facilities" => "Manager",
                "maintenance" => "Engineer",
                "plumbing" => "Plumber", 
                "electrical" => "Electrician",
                "cleaning" => "Cleaner",
                "hvac" => "HVACTechnician",
                "security" => "SecurityPersonnel",
                "it" => "ITSupport",
                "finance" => "EndUser",
                "hr" => "EndUser",
                "general" => "EndUser",
                _ => "EndUser"
            };

            _logger.LogInformation("Mapped department '{Department}' to role '{Role}'", department, role);
            return role;
        }

        /// <summary>
        /// Get the ticket categories that a role can access
        /// </summary>
        public List<TicketCategory> GetCategoriesForRole(string role)
        {
            var categories = role switch
            {
                "Admin" => Enum.GetValues<TicketCategory>().ToList(), // All categories
                "Manager" => Enum.GetValues<TicketCategory>().ToList(), // All categories
                "Plumber" => new List<TicketCategory> { TicketCategory.Plumbing },
                "Electrician" => new List<TicketCategory> { TicketCategory.Electrical },
                "Cleaner" => new List<TicketCategory> { TicketCategory.Cleaning },
                "HVACTechnician" => new List<TicketCategory> { TicketCategory.HVAC },
                "SecurityPersonnel" => new List<TicketCategory> { TicketCategory.Security },
                "ITSupport" => new List<TicketCategory> { TicketCategory.IT },
                "Engineer" => new List<TicketCategory> { TicketCategory.Maintenance, TicketCategory.Safety },
                "EndUser" => new List<TicketCategory>(), // Only own tickets
                _ => new List<TicketCategory>()
            };

            _logger.LogInformation("Role '{Role}' can access categories: {Categories}", 
                role, string.Join(", ", categories));
            return categories;
        }

        /// <summary>
        /// Check if a role can access a specific ticket category
        /// </summary>
        public bool CanRoleAccessCategory(string role, TicketCategory category)
        {
            var allowedCategories = GetCategoriesForRole(role);
            var canAccess = allowedCategories.Contains(category);
            
            _logger.LogDebug("Role '{Role}' access to category '{Category}': {CanAccess}", 
                role, category, canAccess);
            return canAccess;
        }

        /// <summary>
        /// Get all available departments
        /// </summary>
        public List<string> GetAvailableDepartments()
        {
            return new List<string>
            {
                "Administration",
                "Facilities",
                "Maintenance",
                "Plumbing",
                "Electrical",
                "HVAC",
                "IT",
                "Security",
                "Cleaning",
                "General",
                "Finance",
                "HR"
            };
        }

        /// <summary>
        /// Get all available roles
        /// </summary>
        public List<string> GetAvailableRoles()
        {
            return new List<string>
            {
                "Admin",
                "Manager", 
                "Engineer",
                "Plumber",
                "Electrician",
                "Cleaner",
                "HVACTechnician",
                "SecurityPersonnel",
                "ITSupport",
                "EndUser"
            };
        }

        /// <summary>
        /// Validate if a department-role combination is valid
        /// </summary>
        public bool IsValidDepartmentRoleCombination(string department, string role)
        {
            var expectedRole = GetRoleForDepartment(department);
            var isValid = expectedRole.Equals(role, StringComparison.OrdinalIgnoreCase);
            
            _logger.LogDebug("Department '{Department}' with role '{Role}' is valid: {IsValid} (expected: {ExpectedRole})", 
                department, role, isValid, expectedRole);
            return isValid;
        }
    }

    public interface IDepartmentRoleMappingService
    {
        string GetRoleForDepartment(string department);
        List<TicketCategory> GetCategoriesForRole(string role);
        bool CanRoleAccessCategory(string role, TicketCategory category);
        List<string> GetAvailableDepartments();
        List<string> GetAvailableRoles();
        bool IsValidDepartmentRoleCombination(string department, string role);
    }
}
