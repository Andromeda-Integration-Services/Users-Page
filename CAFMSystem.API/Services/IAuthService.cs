using CAFMSystem.API.DTOs;

namespace CAFMSystem.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserProfileDto> GetUserProfileAsync(string userId);
        Task<bool> ValidateTokenAsync(string token);
        Task<IEnumerable<string>> GetUserRolesAsync(string userId);
        Task<IEnumerable<UserDto>> GetUsersByRoleAsync(string role);
    }
}
