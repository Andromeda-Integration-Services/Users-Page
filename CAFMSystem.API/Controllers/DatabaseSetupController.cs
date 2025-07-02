using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using CAFMSystem.API.Models;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseSetupController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<DatabaseSetupController> _logger;

        public DatabaseSetupController(UserManager<ApplicationUser> userManager, ILogger<DatabaseSetupController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        /// <summary>
        /// Reset all user passwords to default values (for database portability)
        /// </summary>
        [HttpPost("reset-all-passwords")]
        public async Task<IActionResult> ResetAllPasswords()
        {
            try
            {
                var results = new List<object>();

                // Define users and their default passwords
                var userPasswords = new Dictionary<string, string>
                {
                    { "admin@cafm.com", "Admin123!" },
                    { "user@cafm.com", "User123!" },
                    { "manager@cafm.com", "Manager123!" },
                    { "plumber@cafm.com", "Plumber123!" },
                    { "electrician@cafm.com", "Electric123!" },
                    { "inzamam@cafm.com", "Cleaner123!" }
                };

                foreach (var userPassword in userPasswords)
                {
                    var user = await _userManager.FindByEmailAsync(userPassword.Key);
                    if (user != null)
                    {
                        // Remove current password
                        await _userManager.RemovePasswordAsync(user);
                        
                        // Add new password
                        var result = await _userManager.AddPasswordAsync(user, userPassword.Value);
                        
                        results.Add(new
                        {
                            email = userPassword.Key,
                            success = result.Succeeded,
                            errors = result.Errors.Select(e => e.Description).ToList()
                        });

                        _logger.LogInformation("Password reset for user: {Email}, Success: {Success}", 
                            userPassword.Key, result.Succeeded);
                    }
                    else
                    {
                        results.Add(new
                        {
                            email = userPassword.Key,
                            success = false,
                            errors = new[] { "User not found" }
                        });
                    }
                }

                return Ok(new
                {
                    message = "Password reset completed for all users",
                    results = results,
                    totalUsers = results.Count,
                    successfulResets = results.Count(r => ((dynamic)r).success)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting all passwords");
                return StatusCode(500, new { message = "An error occurred while resetting passwords", error = ex.Message });
            }
        }

        /// <summary>
        /// Check database setup status
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetSetupStatus()
        {
            try
            {
                var userCount = _userManager.Users.Count();
                var activeUserCount = _userManager.Users.Count(u => u.IsActive);
                
                var users = await Task.Run(() => _userManager.Users.Select(u => new
                {
                    email = u.Email,
                    fullName = u.FullName,
                    department = u.Department,
                    isActive = u.IsActive,
                    hasPassword = !string.IsNullOrEmpty(u.PasswordHash)
                }).ToList());

                return Ok(new
                {
                    databaseConnected = true,
                    totalUsers = userCount,
                    activeUsers = activeUserCount,
                    users = users,
                    setupComplete = userCount >= 6,
                    message = userCount >= 6 ? "Database setup is complete!" : "Database needs setup"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking setup status");
                return StatusCode(500, new { 
                    databaseConnected = false,
                    message = "Database connection failed", 
                    error = ex.Message 
                });
            }
        }
    }
}
