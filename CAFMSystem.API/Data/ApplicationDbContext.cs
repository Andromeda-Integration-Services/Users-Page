using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CAFMSystem.API.Models;

namespace CAFMSystem.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketComment> TicketComments { get; set; }
        public DbSet<TicketAttachment> TicketAttachments { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistories { get; set; }
        public DbSet<AdminMessage> AdminMessages { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Ticket entity
            builder.Entity<Ticket>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.Location)
                    .HasMaxLength(200);

                entity.Property(e => e.OnBehalfOf)
                    .HasMaxLength(200);

                entity.Property(e => e.Type)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Configure relationships
                entity.HasOne(e => e.CreatedBy)
                    .WithMany(u => u.CreatedTickets)
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.AssignedTo)
                    .WithMany(u => u.AssignedTickets)
                    .HasForeignKey(e => e.AssignedToId)
                    .OnDelete(DeleteBehavior.SetNull);

                // Configure indexes
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Priority);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.CreatedById);
                entity.HasIndex(e => e.AssignedToId);
            });

            // Configure TicketComment entity
            builder.Entity<TicketComment>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Comment)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Configure relationships
                entity.HasOne(e => e.Ticket)
                    .WithMany(t => t.Comments)
                    .HasForeignKey(e => e.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany()
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure indexes
                entity.HasIndex(e => e.TicketId);
                entity.HasIndex(e => e.CreatedAt);
            });

            // Configure ApplicationUser entity
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Department)
                    .HasMaxLength(100);

                entity.Property(e => e.EmployeeId)
                    .HasMaxLength(50);

                // entity.Property(e => e.DepartmentId)
                //     .HasMaxLength(20); // Temporarily commented until database is updated

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Configure indexes
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Department);
                // entity.HasIndex(e => e.DepartmentId); // Temporarily commented until database is updated
                entity.HasIndex(e => e.IsActive);
            });

            // Configure TicketAttachment entity
            builder.Entity<TicketAttachment>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.OriginalFileName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.FilePath)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.ContentType)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.UploadedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                // Configure relationships
                entity.HasOne(e => e.Ticket)
                    .WithMany(t => t.Attachments)
                    .HasForeignKey(e => e.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.UploadedBy)
                    .WithMany()
                    .HasForeignKey(e => e.UploadedById)
                    .OnDelete(DeleteBehavior.Restrict);

                // Configure indexes
                entity.HasIndex(e => e.TicketId);
                entity.HasIndex(e => e.UploadedById);
                entity.HasIndex(e => e.UploadedAt);
            });

            // Configure UserLoginHistory entity
            builder.Entity<UserLoginHistory>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired();

                entity.Property(e => e.LoginTime)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.IpAddress)
                    .HasMaxLength(45);

                entity.Property(e => e.UserAgent)
                    .HasMaxLength(500);

                entity.Property(e => e.FailureReason)
                    .HasMaxLength(500);

                // Configure relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure indexes
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.LoginTime);
                entity.HasIndex(e => e.IsSuccessful);
            });

            // Configure AdminMessage entity
            builder.Entity<AdminMessage>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.FromUserId)
                    .IsRequired();

                entity.Property(e => e.ToUserId)
                    .IsRequired();

                entity.Property(e => e.Subject)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasMaxLength(2000);

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.MessageType)
                    .HasMaxLength(50);

                entity.Property(e => e.Priority)
                    .HasMaxLength(20);

                // Configure relationships
                entity.HasOne(e => e.FromUser)
                    .WithMany()
                    .HasForeignKey(e => e.FromUserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.ToUser)
                    .WithMany()
                    .HasForeignKey(e => e.ToUserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure indexes
                entity.HasIndex(e => e.FromUserId);
                entity.HasIndex(e => e.ToUserId);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.IsRead);
                entity.HasIndex(e => e.MessageType);
            });

            // Configure UserActivity entity
            builder.Entity<UserActivity>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.UserId)
                    .IsRequired();

                entity.Property(e => e.ActivityType)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.Timestamp)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(e => e.RelatedEntityId)
                    .HasMaxLength(50);

                entity.Property(e => e.RelatedEntityType)
                    .HasMaxLength(50);

                entity.Property(e => e.IpAddress)
                    .HasMaxLength(45);

                entity.Property(e => e.UserAgent)
                    .HasMaxLength(500);

                entity.Property(e => e.AdditionalData)
                    .HasMaxLength(1000);

                // Configure relationships
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Configure indexes
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.ActivityType);
                entity.HasIndex(e => e.Timestamp);
                entity.HasIndex(e => e.RelatedEntityType);
            });
        }
    }
}
