using CAFMSystem.API.Data;
using Microsoft.EntityFrameworkCore;

namespace CAFMSystem.API.Services
{
    /// <summary>
    /// Service for generating unique department-specific IDs for users
    /// Each department maintains its own sequence of IDs for easier identification
    /// </summary>
    public class DepartmentIdService : IDepartmentIdService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DepartmentIdService> _logger;

        public DepartmentIdService(ApplicationDbContext context, ILogger<DepartmentIdService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Generate a unique department-specific ID for a user
        /// Format: [DEPT_PREFIX][SEQUENCE_NUMBER]
        /// Examples: PLB001, ELC001, HVC001, SEC001, etc.
        /// </summary>
        public async Task<string> GenerateDepartmentIdAsync(string department)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(department))
                {
                    _logger.LogWarning("Department is null or empty, cannot generate department ID");
                    return string.Empty;
                }

                var departmentPrefix = GetDepartmentPrefix(department);
                var nextSequence = await GetNextSequenceForDepartmentAsync(department);
                var departmentId = $"{departmentPrefix}{nextSequence:D3}"; // Format as 3-digit number (001, 002, etc.)

                _logger.LogInformation("Generated department ID: {DepartmentId} for department: {Department}", 
                    departmentId, department);

                return departmentId;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating department ID for department: {Department}", department);
                return string.Empty;
            }
        }

        /// <summary>
        /// Get the next sequence number for a department by counting existing users
        /// </summary>
        private async Task<int> GetNextSequenceForDepartmentAsync(string department)
        {
            try
            {
                var normalizedDepartment = department.ToLower().Trim();
                
                // Count existing users in this department
                var existingUsersCount = await _context.Users
                    .Where(u => u.Department.ToLower() == normalizedDepartment)
                    .CountAsync();

                // Next sequence is count + 1
                var nextSequence = existingUsersCount + 1;

                _logger.LogDebug("Department: {Department}, Existing users: {Count}, Next sequence: {Sequence}", 
                    department, existingUsersCount, nextSequence);

                return nextSequence;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting next sequence for department: {Department}", department);
                return 1; // Default to 1 if error occurs
            }
        }

        /// <summary>
        /// Get department prefix based on department name
        /// </summary>
        private string GetDepartmentPrefix(string department)
        {
            var prefix = department.ToLower().Trim() switch
            {
                "administration" => "ADM",
                "facilities" => "FAC",
                "maintenance" => "MNT",
                "plumbing" => "PLB",
                "electrical" => "ELC",
                "cleaning" => "CLN",
                "hvac" => "HVC",
                "security" => "SEC",
                "it" => "ITS",
                "finance" => "FIN",
                "hr" => "HRS",
                "general" => "GEN",
                _ => "USR" // Default prefix for unknown departments
            };

            _logger.LogDebug("Department: {Department} mapped to prefix: {Prefix}", department, prefix);
            return prefix;
        }

        /// <summary>
        /// Validate if a department ID follows the correct format
        /// </summary>
        public bool IsValidDepartmentId(string departmentId, string department)
        {
            if (string.IsNullOrWhiteSpace(departmentId) || string.IsNullOrWhiteSpace(department))
            {
                return false;
            }

            var expectedPrefix = GetDepartmentPrefix(department);
            return departmentId.StartsWith(expectedPrefix, StringComparison.OrdinalIgnoreCase) &&
                   departmentId.Length == expectedPrefix.Length + 3; // Prefix + 3 digits
        }

        /// <summary>
        /// Get all users with their department IDs for a specific department
        /// </summary>
        public async Task<List<(string UserId, string FullName, string DepartmentId)>> GetDepartmentUsersAsync(string department)
        {
            try
            {
                var normalizedDepartment = department.ToLower().Trim();

                var users = await _context.Users
                    .Where(u => u.Department.ToLower() == normalizedDepartment && u.IsActive)
                    .Select(u => new { u.Id, u.FirstName, u.LastName, u.EmployeeId })
                    .ToListAsync();

                var result = new List<(string UserId, string FullName, string DepartmentId)>();
                var departmentPrefix = GetDepartmentPrefix(department);

                for (int i = 0; i < users.Count; i++)
                {
                    var user = users[i];
                    var departmentId = $"{departmentPrefix}{(i + 1):D3}";
                    result.Add((
                        UserId: user.Id,
                        FullName: $"{user.FirstName} {user.LastName}",
                        DepartmentId: departmentId
                    ));
                }

                _logger.LogInformation("Retrieved {Count} users for department: {Department}", result.Count, department);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users for department: {Department}", department);
                return new List<(string, string, string)>();
            }
        }
    }

    /// <summary>
    /// Interface for department ID service
    /// </summary>
    public interface IDepartmentIdService
    {
        Task<string> GenerateDepartmentIdAsync(string department);
        bool IsValidDepartmentId(string departmentId, string department);
        Task<List<(string UserId, string FullName, string DepartmentId)>> GetDepartmentUsersAsync(string department);
    }
}
