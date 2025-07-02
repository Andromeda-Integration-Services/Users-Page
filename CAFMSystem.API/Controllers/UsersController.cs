using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CAFMSystem.API.Models;
using CAFMSystem.API.DTOs;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<UsersController> _logger;

        public UsersController(UserManager<ApplicationUser> userManager, ILogger<UsersController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        /// <summary>
        /// Get all registered users for dropdowns
        /// </summary>
        [HttpGet("registered")]
        [AllowAnonymous] // Allow access without authentication for dropdown functionality
        public async Task<ActionResult<IEnumerable<RegisteredUserDto>>> GetRegisteredUsers()
        {
            try
            {
                _logger.LogInformation("Fetching all registered users");

                var users = await _userManager.Users
                    .Where(u => u.IsActive)
                    .OrderBy(u => u.FirstName)
                    .ThenBy(u => u.LastName)
                    .ToListAsync();

                var registeredUsers = new List<RegisteredUserDto>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    
                    registeredUsers.Add(new RegisteredUserDto
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        Email = user.Email,
                        Department = user.Department,
                        Roles = roles.ToList()
                    });
                }

                _logger.LogInformation("Successfully fetched {Count} registered users", registeredUsers.Count);
                return Ok(registeredUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching registered users");
                return StatusCode(500, new { message = "An error occurred while fetching users" });
            }
        }

        /// <summary>
        /// Search users for autocomplete (On Behalf Of field)
        /// </summary>
        [HttpGet("search")]
        [AllowAnonymous] // Allow access without authentication for autocomplete functionality
        public async Task<ActionResult<IEnumerable<UserSuggestionDto>>> SearchUsers([FromQuery] string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
                {
                    return Ok(new List<UserSuggestionDto>());
                }

                _logger.LogInformation("Searching users with query: {Query}", query);

                var users = await _userManager.Users
                    .Where(u => u.IsActive && 
                               (u.FirstName.Contains(query) || 
                                u.LastName.Contains(query) || 
                                u.Email.Contains(query) ||
                                u.Department.Contains(query)))
                    .Take(10) // Limit results for performance
                    .ToListAsync();

                var suggestions = users.Select(user => new UserSuggestionDto
                {
                    Name = user.FullName,
                    Type = "ServiceRequestor", // Default type
                    Department = user.Department
                }).ToList();

                _logger.LogInformation("Found {Count} user suggestions for query: {Query}", suggestions.Count, query);
                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching users with query: {Query}", query);
                return StatusCode(500, new { message = "An error occurred while searching users" });
            }
        }

        /// <summary>
        /// Get users by role
        /// </summary>
        [HttpGet("role/{role}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<RegisteredUserDto>>> GetUsersByRole(string role)
        {
            try
            {
                _logger.LogInformation("Fetching users with role: {Role}", role);

                var usersInRole = await _userManager.GetUsersInRoleAsync(role);
                var activeUsers = usersInRole.Where(u => u.IsActive).ToList();

                var registeredUsers = activeUsers.Select(user => new RegisteredUserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Department = user.Department,
                    Roles = new List<string> { role }
                }).ToList();

                _logger.LogInformation("Successfully fetched {Count} users with role: {Role}", registeredUsers.Count, role);
                return Ok(registeredUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users by role: {Role}", role);
                return StatusCode(500, new { message = "An error occurred while fetching users by role" });
            }
        }
    }
}
