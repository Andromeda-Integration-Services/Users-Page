using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAFMSystem.API.Models
{
    public class AdminMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FromUserId { get; set; } = string.Empty;

        [Required]
        public string ToUserId { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Message { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        public DateTime? ReadAt { get; set; }

        [StringLength(50)]
        public string MessageType { get; set; } = "General"; // General, Task, Alert, Announcement

        [StringLength(20)]
        public string Priority { get; set; } = "Normal"; // Low, Normal, High, Urgent

        public bool IsDeleted { get; set; } = false;

        public DateTime? DeletedAt { get; set; }

        // Navigation Properties
        [ForeignKey("FromUserId")]
        public virtual ApplicationUser FromUser { get; set; } = null!;

        [ForeignKey("ToUserId")]
        public virtual ApplicationUser ToUser { get; set; } = null!;
    }
}
