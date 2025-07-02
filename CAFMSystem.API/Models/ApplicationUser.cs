using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace CAFMSystem.API.Models
{
    public class ApplicationUser : IdentityUser
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

        // [StringLength(20)]
        // public string DepartmentId { get; set; } = string.Empty; // Temporarily commented until database is updated

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();
        public virtual ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();

        // Full name property
        public string FullName => $"{FirstName} {LastName}";
    }
}
