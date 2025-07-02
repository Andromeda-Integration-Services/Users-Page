using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CAFMSystem.API.DTOs;
using CAFMSystem.API.Services;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly IDepartmentIdService _departmentIdService;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, IDepartmentIdService departmentIdService)
        {
            _authService = authService;
            _logger = logger;
            _departmentIdService = departmentIdService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                    });
                }

                var result = await _authService.RegisterAsync(registerDto);
                
                if (result.Success)
                {
                    _logger.LogInformation("User registered successfully: {Email}", registerDto.Email);
                    return Ok(result);
                }

                _logger.LogWarning("Registration failed for email: {Email}", registerDto.Email);
                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred",
                    Errors = new List<string> { "Registration failed" }
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid input data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList()
                    });
                }

                var result = await _authService.LoginAsync(loginDto);
                
                if (result.Success)
                {
                    _logger.LogInformation("User logged in successfully: {Email}", loginDto.Email);
                    return Ok(result);
                }

                _logger.LogWarning("Login failed for email: {Email}", loginDto.Email);
                return Unauthorized(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user login");
                return StatusCode(500, new AuthResponseDto
                {
                    Success = false,
                    Message = "An internal error occurred",
                    Errors = new List<string> { "Login failed" }
                });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserProfileDto>> GetProfile()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var profile = await _authService.GetUserProfileAsync(userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user profile");
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        [HttpGet("validate-token")]
        [Authorize]
        public async Task<ActionResult<TokenValidationDto>> ValidateToken()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Ok(new TokenValidationDto
                    {
                        IsValid = false,
                        Message = "Invalid token"
                    });
                }

                return Ok(new TokenValidationDto
                {
                    IsValid = true,
                    UserId = userId,
                    Message = "Token is valid"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Ok(new TokenValidationDto
                {
                    IsValid = false,
                    Message = "Token validation failed"
                });
            }
        }

        [HttpGet("roles")]
        public ActionResult<IEnumerable<string>> GetRoles()
        {
            var roles = new[] { "Admin", "Manager", "Engineer", "Plumber", "Electrician", "Cleaner", "HVACTechnician", "SecurityPersonnel", "ITSupport", "EndUser" };
            return Ok(roles);
        }

        [HttpGet("users/role/{role}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersByRole(string role)
        {
            try
            {
                var users = await _authService.GetUsersByRoleAsync(role);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users by role: {Role}", role);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }

        [HttpGet("test-department-id/{department}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> TestDepartmentIdGeneration(string department)
        {
            try
            {
                var departmentId = await _departmentIdService.GenerateDepartmentIdAsync(department);
                var isValid = _departmentIdService.IsValidDepartmentId(departmentId, department);

                return Ok(new
                {
                    Department = department,
                    GeneratedDepartmentId = departmentId,
                    IsValid = isValid,
                    Message = $"Department ID '{departmentId}' generated for department '{department}'"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing department ID generation for department: {Department}", department);
                return StatusCode(500, new { message = "An internal error occurred" });
            }
        }
    }
}
