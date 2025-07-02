using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CAFMSystem.API.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public TicketStatus Status { get; set; } = TicketStatus.Open;

        [Required]
        public TicketPriority Priority { get; set; } = TicketPriority.Medium;

        [Required]
        public TicketCategory Category { get; set; } = TicketCategory.General;

        [Required]
        public TicketType Type { get; set; } = TicketType.Service;

        [StringLength(200)]
        public string Location { get; set; } = string.Empty;

        [StringLength(200)]
        public string? OnBehalfOf { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime? DueDate { get; set; }

        // Foreign Keys
        [Required]
        public string CreatedById { get; set; } = string.Empty;

        public string? AssignedToId { get; set; }

        // Navigation Properties
        [ForeignKey("CreatedById")]
        public virtual ApplicationUser CreatedBy { get; set; } = null!;

        [ForeignKey("AssignedToId")]
        public virtual ApplicationUser? AssignedTo { get; set; }

        public virtual ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
        public virtual ICollection<TicketAttachment> Attachments { get; set; } = new List<TicketAttachment>();
    }

    public enum TicketStatus
    {
        Open = 1,
        InProgress = 2,
        OnHold = 3,
        Resolved = 4,
        Closed = 5,
        Cancelled = 6
    }

    public enum TicketPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4,
        Emergency = 5
    }

    public enum TicketCategory
    {
        General = 1,
        Plumbing = 2,
        Electrical = 3,
        HVAC = 4,
        Cleaning = 5,
        Security = 6,
        IT = 7,
        Maintenance = 8,
        Safety = 9,
        Other = 10
    }

    public enum TicketType
    {
        Material = 1,
        Service = 2
    }
}
