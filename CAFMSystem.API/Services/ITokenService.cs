using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    public interface ITokenService
    {
        Task<string> GenerateTokenAsync(ApplicationUser user);
        bool ValidateToken(string token);
        string GetUserIdFromToken(string token);
    }
}
