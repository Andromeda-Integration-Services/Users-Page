using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAFMSystem.API.Models
{
    public class UserActivity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string ActivityType { get; set; } = string.Empty; // Login, TicketCreated, TicketUpdated, MessageSent, etc.

        [Required]
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string? RelatedEntityId { get; set; } // Ticket ID, Message ID, etc.

        [StringLength(50)]
        public string? RelatedEntityType { get; set; } // Ticket, Message, User, etc.

        [StringLength(45)] // IPv6 max length
        public string? IpAddress { get; set; }

        [StringLength(500)]
        public string? UserAgent { get; set; }

        [StringLength(1000)]
        public string? AdditionalData { get; set; } // JSON string for extra data

        // Navigation Properties
        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; } = null!;
    }
}
