using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CAFMSystem.API.Services;
using CAFMSystem.API.DTOs;
using System.Security.Claims;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IAdminUserService _adminUserService;
        private readonly ILogger<AdminUsersController> _logger;

        public AdminUsersController(IAdminUserService adminUserService, ILogger<AdminUsersController> logger)
        {
            _adminUserService = adminUserService;
            _logger = logger;
        }

        /// <summary>
        /// Get all users with pagination and filtering
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetAllUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? department = null,
            [FromQuery] string? role = null)
        {
            try
            {
                _logger.LogInformation("Admin {AdminId} requesting users list", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                
                var users = await _adminUserService.GetAllUsersAsync(pageNumber, pageSize, searchTerm, department, role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users list");
                return StatusCode(500, new { message = "An error occurred while retrieving users" });
            }
        }

        /// <summary>
        /// Get all users without pagination
        /// </summary>
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetAllUsersUnpaginated(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? department = null,
            [FromQuery] string? role = null)
        {
            try
            {
                _logger.LogInformation("Admin {AdminId} requesting all users (unpaginated)", User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                var users = await _adminUserService.GetAllUsersUnpaginatedAsync(searchTerm, department, role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all users");
                return StatusCode(500, new { message = "An error occurred while retrieving users" });
            }
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        [HttpGet("{userId}")]
        public async Task<ActionResult<AdminUserDto>> GetUserById(string userId)
        {
            try
            {
                var user = await _adminUserService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving user" });
            }
        }

        /// <summary>
        /// Create new user
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<AdminUserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Admin {AdminId} creating new user {Email}", adminId, createUserDto.Email);

                var user = await _adminUserService.CreateUserAsync(createUserDto);
                
                // Log admin activity
                await _adminUserService.LogUserActivityAsync(adminId!, "UserCreated", $"Created user: {createUserDto.Email}", user.Id, "User");

                return CreatedAtAction(nameof(GetUserById), new { userId = user.Id }, user);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Failed to create user {Email}", createUserDto.Email);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user {Email}", createUserDto.Email);
                return StatusCode(500, new { message = "An error occurred while creating user" });
            }
        }

        /// <summary>
        /// Update user
        /// </summary>
        [HttpPut("{userId}")]
        public async Task<ActionResult<AdminUserDto>> UpdateUser(string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Admin {AdminId} updating user {UserId}", adminId, userId);

                var user = await _adminUserService.UpdateUserAsync(userId, updateUserDto);
                
                // Log admin activity
                await _adminUserService.LogUserActivityAsync(adminId!, "UserUpdated", $"Updated user: {user.Email}", userId, "User");

                return Ok(user);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "User {UserId} not found for update", userId);
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Failed to update user {UserId}", userId);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while updating user" });
            }
        }

        /// <summary>
        /// Delete (deactivate) user
        /// </summary>
        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteUser(string userId)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Admin {AdminId} deleting user {UserId}", adminId, userId);

                var success = await _adminUserService.DeleteUserAsync(userId);
                if (!success)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Log admin activity
                await _adminUserService.LogUserActivityAsync(adminId!, "UserDeleted", $"Deactivated user: {userId}", userId, "User");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while deleting user" });
            }
        }

        /// <summary>
        /// Toggle user active status
        /// </summary>
        [HttpPatch("{userId}/toggle-status")]
        public async Task<ActionResult> ToggleUserStatus(string userId)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Admin {AdminId} toggling status for user {UserId}", adminId, userId);

                var success = await _adminUserService.ToggleUserStatusAsync(userId);
                if (!success)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Log admin activity
                await _adminUserService.LogUserActivityAsync(adminId!, "UserStatusToggled", $"Toggled status for user: {userId}", userId, "User");

                return Ok(new { message = "User status toggled successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling status for user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while toggling user status" });
            }
        }

        /// <summary>
        /// Get user login history
        /// </summary>
        [HttpGet("{userId}/login-history")]
        public async Task<ActionResult<IEnumerable<UserLoginHistoryDto>>> GetUserLoginHistory(
            string userId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var history = await _adminUserService.GetUserLoginHistoryAsync(userId, pageNumber, pageSize);
                return Ok(history);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving login history for user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving login history" });
            }
        }

        /// <summary>
        /// Get user activity history
        /// </summary>
        [HttpGet("{userId}/activity")]
        public async Task<ActionResult<IEnumerable<UserActivityDto>>> GetUserActivity(
            string userId,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var activity = await _adminUserService.GetUserActivityAsync(userId, pageNumber, pageSize);
                return Ok(activity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving activity for user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving user activity" });
            }
        }

        /// <summary>
        /// Get user statistics
        /// </summary>
        [HttpGet("{userId}/statistics")]
        public async Task<ActionResult> GetUserStatistics(string userId)
        {
            try
            {
                var stats = await _adminUserService.GetUserStatisticsAsync(userId);
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving statistics for user {UserId}", userId);
                return StatusCode(500, new { message = "An error occurred while retrieving user statistics" });
            }
        }

        /// <summary>
        /// Get system statistics
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult> GetSystemStatistics()
        {
            try
            {
                var stats = await _adminUserService.GetSystemStatisticsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system statistics");
                return StatusCode(500, new { message = "An error occurred while retrieving system statistics" });
            }
        }

        /// <summary>
        /// Get available departments
        /// </summary>
        [HttpGet("departments")]
        public async Task<ActionResult<IEnumerable<string>>> GetDepartments()
        {
            try
            {
                var departments = await _adminUserService.GetDepartmentsAsync();
                return Ok(departments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving departments");
                return StatusCode(500, new { message = "An error occurred while retrieving departments" });
            }
        }

        /// <summary>
        /// Get available roles
        /// </summary>
        [HttpGet("roles")]
        public async Task<ActionResult<IEnumerable<string>>> GetRoles()
        {
            try
            {
                var roles = await _adminUserService.GetRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving roles");
                return StatusCode(500, new { message = "An error occurred while retrieving roles" });
            }
        }

        /// <summary>
        /// Bulk update user status
        /// </summary>
        [HttpPatch("bulk-status")]
        public async Task<ActionResult> BulkUpdateUserStatus([FromBody] BulkUpdateStatusDto bulkUpdateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Admin {AdminId} performing bulk status update for {Count} users", adminId, bulkUpdateDto.UserIds.Count);

                var result = await _adminUserService.BulkUpdateUserStatusAsync(bulkUpdateDto.UserIds, bulkUpdateDto.IsActive);

                // Log admin activity
                await _adminUserService.LogUserActivityAsync(adminId!, "BulkStatusUpdate",
                    $"Bulk updated status for {result.UpdatedCount} users to {(bulkUpdateDto.IsActive ? "Active" : "Inactive")}",
                    null, "BulkOperation");

                return Ok(new {
                    message = $"Successfully updated {result.UpdatedCount} users",
                    updatedCount = result.UpdatedCount,
                    failedCount = result.FailedCount,
                    errors = result.Errors
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error performing bulk status update");
                return StatusCode(500, new { message = "An error occurred while performing bulk status update" });
            }
        }

        /// <summary>
        /// Export users to CSV
        /// </summary>
        [HttpGet("export")]
        public async Task<ActionResult> ExportUsers(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? department = null,
            [FromQuery] string? role = null)
        {
            try
            {
                var adminId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation("Admin {AdminId} exporting users", adminId);

                var csvData = await _adminUserService.ExportUsersAsync(searchTerm, department, role);

                // Log admin activity
                await _adminUserService.LogUserActivityAsync(adminId!, "UsersExported",
                    "Exported users to CSV", null, "Export");

                return File(csvData, "text/csv", $"users_export_{DateTime.UtcNow:yyyyMMdd_HHmmss}.csv");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting users");
                return StatusCode(500, new { message = "An error occurred while exporting users" });
            }
        }
    }
}
