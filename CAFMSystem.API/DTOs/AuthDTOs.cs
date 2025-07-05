using System.ComponentModel.DataAnnotations;

namespace CAFMSystem.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(100)]
        public string Department { get; set; } = string.Empty;

        [StringLength(50)]
        public string EmployeeId { get; set; } = string.Empty;

        public string Role { get; set; } = "EndUser";
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public UserDto? User { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }

    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        // public string DepartmentId { get; set; } = string.Empty; // Temporarily commented until database is updated
        public List<string> Roles { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        // public string DepartmentId { get; set; } = string.Empty; // Temporarily commented until database is updated
        public List<string> Roles { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class TokenValidationDto
    {
        public bool IsValid { get; set; }
        public string? UserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    // DTOs for User Management
    public class RegisteredUserDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Department { get; set; }
        // public string? DepartmentId { get; set; } // Temporarily commented until database is updated
        public List<string> Roles { get; set; } = new List<string>();
    }

    // Enhanced DTOs for Admin User Management
    public class AdminUserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public bool EmailConfirmed { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public bool IsActive { get; set; }
        public int TotalTicketsCreated { get; set; }
        public int TotalTicketsAssigned { get; set; }
        public int TotalTicketsCompleted { get; set; }
        public int UnreadMessages { get; set; }
        public DateTime? LastActivityAt { get; set; }
    }

    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(100)]
        public string Department { get; set; } = string.Empty;

        [StringLength(50)]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        public List<string> Roles { get; set; } = new List<string>();

        public bool IsActive { get; set; } = true;
    }

    public class UpdateUserDto
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(100)]
        public string Department { get; set; } = string.Empty;

        [StringLength(50)]
        public string EmployeeId { get; set; } = string.Empty;

        [Required]
        public List<string> Roles { get; set; } = new List<string>();

        public bool IsActive { get; set; } = true;
    }

    public class UserLoginHistoryDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public DateTime LoginTime { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public bool IsSuccessful { get; set; }
    }

    public class AdminMessageDto
    {
        public int Id { get; set; }
        public string FromUserId { get; set; } = string.Empty;
        public string FromUserName { get; set; } = string.Empty;
        public string ToUserId { get; set; } = string.Empty;
        public string ToUserName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public string MessageType { get; set; } = "General"; // General, Task, Alert, Announcement
    }

    public class CreateMessageDto
    {
        [Required]
        public string ToUserId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Message { get; set; } = string.Empty;

        public string MessageType { get; set; } = "General";
    }

    public class UserActivityDto
    {
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string ActivityType { get; set; } = string.Empty; // Login, TicketCreated, TicketUpdated, etc.
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; }
    }

    public class UserSuggestionDto
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "ServiceOfficer" or "ServiceRequestor"
        public string? Department { get; set; }
    }

    // DTOs for Ticket Management
    public class CreateTicketDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Priority { get; set; }
        public int Type { get; set; }
        public int? Category { get; set; } // Optional - will be auto-detected if not provided
        public string Location { get; set; } = string.Empty;
        public string RequestedByUserId { get; set; } = string.Empty;
        public string? OnBehalfOf { get; set; }
        public string? ImageBase64 { get; set; }
        public string? ImageFileName { get; set; }
        // Note: File attachments are handled separately via multipart form data
    }

    public class TicketDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int Priority { get; set; }
        public string PriorityText { get; set; } = string.Empty;
        public int Status { get; set; }
        public string StatusText { get; set; } = string.Empty;
        public int Category { get; set; }
        public string CategoryText { get; set; } = string.Empty;
        public int Type { get; set; }
        public string TypeText { get; set; } = string.Empty;
        public string? ImagePath { get; set; }
        public string? ExtractedKeywords { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
        public string? AssignedAt { get; set; }
        public string? CompletedAt { get; set; }
        public string? ClosedAt { get; set; }
        public string? DueDate { get; set; }
        public bool IsOverdue { get; set; }
        public string CreatedByUserId { get; set; } = string.Empty;
        public string CreatedByUserName { get; set; } = string.Empty;
        public string CreatedByUserEmail { get; set; } = string.Empty;
        public string RequestedByUserId { get; set; } = string.Empty;
        public string RequestedByUserName { get; set; } = string.Empty;
        public string RequestedByUserEmail { get; set; } = string.Empty;
        public string? OnBehalfOf { get; set; }
        public string? AssignedToUserId { get; set; }
        public string? AssignedToUserName { get; set; }
        public string? AssignedToUserEmail { get; set; }
        public List<TicketAttachmentDto> Attachments { get; set; } = new List<TicketAttachmentDto>();
    }

    public class UpdateTicketDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public int? Priority { get; set; }
        public int? Status { get; set; }
        public int? Category { get; set; }
        public string? AssignedToUserId { get; set; }
    }

    public class TicketListResponseDto
    {
        public List<TicketDto> Tickets { get; set; } = new List<TicketDto>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }

    // DTOs for File Attachments
    public class TicketAttachmentDto
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileSizeFormatted { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }
        public string UploadedById { get; set; } = string.Empty;
        public string UploadedByName { get; set; } = string.Empty;
        public bool IsImage { get; set; }
        public string FileIcon { get; set; } = string.Empty;
    }

    public class FileUploadResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<TicketAttachmentDto> UploadedFiles { get; set; } = new List<TicketAttachmentDto>();
        public List<string> Errors { get; set; } = new List<string>();
    }

    public class SystemStatisticsDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int TotalTickets { get; set; }
        public int TotalMessages { get; set; }
        public int UnreadMessages { get; set; }
        public int TodayLogins { get; set; }
        public List<DepartmentStatDto> DepartmentStats { get; set; } = new List<DepartmentStatDto>();
    }

    public class DepartmentStatDto
    {
        public string Department { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class BulkUpdateStatusDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "At least one user ID must be provided")]
        public List<string> UserIds { get; set; } = new List<string>();

        [Required]
        public bool IsActive { get; set; }
    }

    public class BulkUpdateResult
    {
        public int UpdatedCount { get; set; }
        public int FailedCount { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }
}
