using CAFMSystem.API.DTOs;

namespace CAFMSystem.API.Services
{
    public interface IAdminUserService
    {
        // User Management CRUD
        Task<IEnumerable<AdminUserDto>> GetAllUsersAsync(int pageNumber = 1, int pageSize = 10, string? searchTerm = null, string? department = null, string? role = null);
        Task<IEnumerable<AdminUserDto>> GetAllUsersUnpaginatedAsync(string? searchTerm = null, string? department = null, string? role = null);
        Task<AdminUserDto?> GetUserByIdAsync(string userId);
        Task<AdminUserDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<AdminUserDto> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> ToggleUserStatusAsync(string userId);

        // User Activity & History
        Task<IEnumerable<UserLoginHistoryDto>> GetUserLoginHistoryAsync(string userId, int pageNumber = 1, int pageSize = 20);
        Task<IEnumerable<UserActivityDto>> GetUserActivityAsync(string userId, int pageNumber = 1, int pageSize = 20);
        Task LogUserActivityAsync(string userId, string activityType, string description, string? relatedEntityId = null, string? relatedEntityType = null, string? ipAddress = null, string? userAgent = null);

        // Admin Messaging
        Task<AdminMessageDto> SendMessageToUserAsync(string fromUserId, CreateMessageDto messageDto);
        Task<IEnumerable<AdminMessageDto>> GetUserMessagesAsync(string userId, bool unreadOnly = false, int pageNumber = 1, int pageSize = 20);
        Task<IEnumerable<AdminMessageDto>> GetSentMessagesAsync(string fromUserId, int pageNumber = 1, int pageSize = 20);
        Task<bool> MarkMessageAsReadAsync(int messageId, string userId);
        Task<int> GetUnreadMessageCountAsync(string userId);

        // Statistics & Analytics
        Task<object> GetUserStatisticsAsync(string userId);
        Task<object> GetSystemStatisticsAsync();

        // Additional Admin Operations
        Task<IEnumerable<string>> GetDepartmentsAsync();
        Task<IEnumerable<string>> GetRolesAsync();
        Task<BulkUpdateResult> BulkUpdateUserStatusAsync(List<string> userIds, bool isActive);
        Task<byte[]> ExportUsersAsync(string? searchTerm = null, string? department = null, string? role = null);
    }
}
