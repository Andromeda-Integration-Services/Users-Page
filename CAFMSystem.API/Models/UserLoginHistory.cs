using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAFMSystem.API.Models
{
    public class UserLoginHistory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public DateTime LoginTime { get; set; } = DateTime.UtcNow;

        [StringLength(45)] // IPv6 max length
        public string IpAddress { get; set; } = string.Empty;

        [StringLength(500)]
        public string UserAgent { get; set; } = string.Empty;

        public bool IsSuccessful { get; set; } = true;

        [StringLength(500)]
        public string? FailureReason { get; set; }

        public DateTime? LogoutTime { get; set; }

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
