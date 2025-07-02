using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CAFMSystem.API.DTOs;
using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IDepartmentRoleMappingService _departmentRoleMappingService;
        private readonly IDepartmentIdService _departmentIdService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IDepartmentRoleMappingService departmentRoleMappingService,
            IDepartmentIdService departmentIdService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _departmentRoleMappingService = departmentRoleMappingService;
            _departmentIdService = departmentIdService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "User with this email already exists",
                        Errors = new List<string> { "Email already registered" }
                    };
                }

                // Generate department-specific ID
                var departmentId = await _departmentIdService.GenerateDepartmentIdAsync(registerDto.Department);

                // Create new user
                var user = new ApplicationUser
                {
                    UserName = registerDto.Email,
                    Email = registerDto.Email,
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Department = registerDto.Department,
                    EmployeeId = registerDto.EmployeeId,
                    // DepartmentId = departmentId, // Temporarily commented until database is updated
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await _userManager.CreateAsync(user, registerDto.Password);

                if (result.Succeeded)
                {
                    // Determine role based on department
                    var assignedRole = _departmentRoleMappingService.GetRoleForDepartment(registerDto.Department);

                    // Assign role
                    await _userManager.AddToRoleAsync(user, assignedRole);

                    // Generate token
                    var token = await _tokenService.GenerateTokenAsync(user);
                    var roles = await _userManager.GetRolesAsync(user);

                    return new AuthResponseDto
                    {
                        Success = true,
                        Message = "User registered successfully",
                        Token = token,
                        User = new UserDto
                        {
                            Id = user.Id,
                            Email = user.Email,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            FullName = user.FullName,
                            Department = user.Department,
                            EmployeeId = user.EmployeeId,
                            // DepartmentId = departmentId, // Temporarily commented until database is updated
                            Roles = roles.ToList(),
                            CreatedAt = user.CreatedAt,
                            IsActive = user.IsActive
                        }
                    };
                }

                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Registration failed",
                    Errors = result.Errors.Select(e => e.Description).ToList()
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred during registration",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null || !user.IsActive)
                {
                    return new AuthResponseDto
                    {
                        Success = false,
                        Message = "Invalid email or password",
                        Errors = new List<string> { "Authentication failed" }
                    };
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
                if (result.Succeeded)
                {
                    // Update last login
                    user.LastLoginAt = DateTime.UtcNow;
                    await _userManager.UpdateAsync(user);

                    // Generate token
                    var token = await _tokenService.GenerateTokenAsync(user);
                    var roles = await _userManager.GetRolesAsync(user);

                    return new AuthResponseDto
                    {
                        Success = true,
                        Message = "Login successful",
                        Token = token,
                        User = new UserDto
                        {
                            Id = user.Id,
                            Email = user.Email,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            FullName = user.FullName,
                            Department = user.Department,
                            EmployeeId = user.EmployeeId,
                            Roles = roles.ToList(),
                            CreatedAt = user.CreatedAt,
                            LastLoginAt = user.LastLoginAt,
                            IsActive = user.IsActive
                        }
                    };
                }

                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or password",
                    Errors = new List<string> { "Authentication failed" }
                };
            }
            catch (Exception ex)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "An error occurred during login",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<UserProfileDto> GetUserProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var roles = await _userManager.GetRolesAsync(user);

            // Generate department ID temporarily
            var departmentId = await _departmentIdService.GenerateDepartmentIdAsync(user.Department);

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                Department = user.Department,
                EmployeeId = user.EmployeeId,
                // DepartmentId = departmentId, // Temporarily commented until database is updated
                Roles = roles.ToList(),
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                IsActive = user.IsActive
            };
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            return _tokenService.ValidateToken(token);
        }

        public async Task<IEnumerable<string>> GetUserRolesAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new List<string>();
            }

            return await _userManager.GetRolesAsync(user);
        }

        public async Task<IEnumerable<UserDto>> GetUsersByRoleAsync(string role)
        {
            var users = await _userManager.GetUsersInRoleAsync(role);
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var departmentId = await _departmentIdService.GenerateDepartmentIdAsync(user.Department);

                userDtos.Add(new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    FullName = user.FullName,
                    Department = user.Department,
                    EmployeeId = user.EmployeeId,
                    // DepartmentId = departmentId, // Temporarily commented until database is updated
                    Roles = roles.ToList(),
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt,
                    IsActive = user.IsActive
                });
            }

            return userDtos;
        }
    }
}
