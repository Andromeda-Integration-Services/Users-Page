using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CAFMSystem.API.Data;
using CAFMSystem.API.Models;
using CAFMSystem.API.DTOs;
using CAFMSystem.API.Services;

namespace CAFMSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class FilesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<FilesController> _logger;
        private readonly IFileStorageService _fileStorageService;
        private readonly ITicketAccessService _ticketAccessService;

        public FilesController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<FilesController> logger,
            IFileStorageService fileStorageService,
            ITicketAccessService ticketAccessService)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _fileStorageService = fileStorageService;
            _ticketAccessService = ticketAccessService;
        }

        /// <summary>
        /// Upload files for a specific ticket
        /// </summary>
        [HttpPost("upload/{ticketId}")]
        public async Task<ActionResult<FileUploadResponseDto>> UploadFiles(int ticketId, List<IFormFile> files)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // Check if ticket exists and user has access
                var ticket = await _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .FirstOrDefaultAsync(t => t.Id == ticketId);

                if (ticket == null)
                {
                    return NotFound(new { message = "Ticket not found" });
                }

                // Check if user has access to this ticket
                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                var userRoles = await _userManager.GetRolesAsync(currentUser!);

                var hasAccess = _ticketAccessService.CanViewTicket(ticket, currentUserId, userRoles);
                if (!hasAccess)
                {
                    return Forbid("You don't have access to this ticket");
                }

                var response = new FileUploadResponseDto { Success = true };
                var uploadedFiles = new List<TicketAttachmentDto>();

                if (files == null || files.Count == 0)
                {
                    response.Success = false;
                    response.Message = "No files provided";
                    return BadRequest(response);
                }

                foreach (var file in files)
                {
                    try
                    {
                        // Validate file
                        if (!_fileStorageService.IsValidFileType(file.ContentType))
                        {
                            response.Errors.Add($"File '{file.FileName}': Invalid file type '{file.ContentType}'");
                            continue;
                        }

                        if (!_fileStorageService.IsValidFileSize(file.Length))
                        {
                            response.Errors.Add($"File '{file.FileName}': File size exceeds maximum allowed size");
                            continue;
                        }

                        // Save file to storage
                        var filePath = await _fileStorageService.SaveFileAsync(file, ticketId, currentUserId);

                        // Create database record
                        var attachment = new TicketAttachment
                        {
                            TicketId = ticketId,
                            FileName = _fileStorageService.GenerateUniqueFileName(file.FileName, ticketId),
                            OriginalFileName = file.FileName,
                            FilePath = filePath,
                            ContentType = file.ContentType,
                            FileSize = file.Length,
                            UploadedById = currentUserId,
                            UploadedAt = DateTime.UtcNow
                        };

                        _context.TicketAttachments.Add(attachment);
                        await _context.SaveChangesAsync();

                        // Create DTO for response
                        var attachmentDto = MapToAttachmentDto(attachment, currentUser!);
                        uploadedFiles.Add(attachmentDto);

                        _logger.LogInformation("File uploaded successfully: {FileName} for ticket {TicketId} by user {UserId}", 
                            file.FileName, ticketId, currentUserId);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error uploading file {FileName} for ticket {TicketId}", file.FileName, ticketId);
                        response.Errors.Add($"File '{file.FileName}': {ex.Message}");
                    }
                }

                response.UploadedFiles = uploadedFiles;
                response.Message = uploadedFiles.Count > 0 
                    ? $"Successfully uploaded {uploadedFiles.Count} file(s)" 
                    : "No files were uploaded";

                if (response.Errors.Count > 0)
                {
                    response.Success = uploadedFiles.Count > 0; // Partial success if some files uploaded
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in file upload for ticket {TicketId}", ticketId);
                return StatusCode(500, new FileUploadResponseDto 
                { 
                    Success = false, 
                    Message = "Internal server error during file upload" 
                });
            }
        }

        /// <summary>
        /// Download a specific file
        /// </summary>
        [HttpGet("download/{attachmentId}")]
        public async Task<IActionResult> DownloadFile(int attachmentId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // Get attachment with ticket information
                var attachment = await _context.TicketAttachments
                    .Include(a => a.Ticket)
                    .ThenInclude(t => t.CreatedBy)
                    .Include(a => a.Ticket)
                    .ThenInclude(t => t.AssignedTo)
                    .FirstOrDefaultAsync(a => a.Id == attachmentId);

                if (attachment == null)
                {
                    return NotFound(new { message = "File not found" });
                }

                // Check if user has access to the ticket
                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                var userRoles = await _userManager.GetRolesAsync(currentUser!);

                var hasAccess = _ticketAccessService.CanViewTicket(attachment.Ticket, currentUserId, userRoles);
                if (!hasAccess)
                {
                    return Forbid("You don't have access to this file");
                }

                // Get file from storage
                var (fileData, contentType, fileName) = await _fileStorageService.GetFileAsync(attachment.FilePath);

                return File(fileData, contentType, attachment.OriginalFileName);
            }
            catch (FileNotFoundException)
            {
                return NotFound(new { message = "File not found on disk" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading file {AttachmentId}", attachmentId);
                return StatusCode(500, new { message = "Error downloading file" });
            }
        }

        /// <summary>
        /// Delete a specific file attachment
        /// </summary>
        [HttpDelete("{attachmentId}")]
        public async Task<IActionResult> DeleteFile(int attachmentId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var attachment = await _context.TicketAttachments
                    .Include(a => a.Ticket)
                    .ThenInclude(t => t.CreatedBy)
                    .Include(a => a.Ticket)
                    .ThenInclude(t => t.AssignedTo)
                    .FirstOrDefaultAsync(a => a.Id == attachmentId);

                if (attachment == null)
                {
                    return NotFound(new { message = "File not found" });
                }

                // Check if user has access to the ticket
                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                var userRoles = await _userManager.GetRolesAsync(currentUser!);

                var hasAccess = _ticketAccessService.CanViewTicket(attachment.Ticket, currentUserId, userRoles);
                if (!hasAccess)
                {
                    return Forbid("You don't have access to this file");
                }

                // Only allow file deletion by the uploader or admin
                if (attachment.UploadedById != currentUserId && !userRoles.Contains("Admin"))
                {
                    return Forbid("You can only delete files you uploaded");
                }

                // Delete file from storage
                await _fileStorageService.DeleteFileAsync(attachment.FilePath);

                // Delete database record
                _context.TicketAttachments.Remove(attachment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("File deleted successfully: {AttachmentId} by user {UserId}", attachmentId, currentUserId);

                return Ok(new { message = "File deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file {AttachmentId}", attachmentId);
                return StatusCode(500, new { message = "Error deleting file" });
            }
        }

        /// <summary>
        /// Get all attachments for a specific ticket
        /// </summary>
        [HttpGet("ticket/{ticketId}")]
        public async Task<ActionResult<List<TicketAttachmentDto>>> GetTicketAttachments(int ticketId)
        {
            try
            {
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // Check if ticket exists and user has access
                var ticket = await _context.Tickets
                    .Include(t => t.CreatedBy)
                    .Include(t => t.AssignedTo)
                    .FirstOrDefaultAsync(t => t.Id == ticketId);

                if (ticket == null)
                {
                    return NotFound(new { message = "Ticket not found" });
                }

                var currentUser = await _userManager.FindByIdAsync(currentUserId);
                var userRoles = await _userManager.GetRolesAsync(currentUser!);

                var hasAccess = _ticketAccessService.CanViewTicket(ticket, currentUserId, userRoles);
                if (!hasAccess)
                {
                    return Forbid("You don't have access to this ticket");
                }

                // Get attachments
                var attachments = await _context.TicketAttachments
                    .Include(a => a.UploadedBy)
                    .Where(a => a.TicketId == ticketId)
                    .OrderByDescending(a => a.UploadedAt)
                    .ToListAsync();

                var attachmentDtos = attachments.Select(a => MapToAttachmentDto(a, a.UploadedBy)).ToList();

                return Ok(attachmentDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting attachments for ticket {TicketId}", ticketId);
                return StatusCode(500, new { message = "Error retrieving attachments" });
            }
        }

        private TicketAttachmentDto MapToAttachmentDto(TicketAttachment attachment, ApplicationUser uploadedBy)
        {
            return new TicketAttachmentDto
            {
                Id = attachment.Id,
                TicketId = attachment.TicketId,
                FileName = attachment.FileName,
                OriginalFileName = attachment.OriginalFileName,
                ContentType = attachment.ContentType,
                FileSize = attachment.FileSize,
                FileSizeFormatted = FormatFileSize(attachment.FileSize),
                UploadedAt = attachment.UploadedAt,
                UploadedById = attachment.UploadedById,
                UploadedByName = $"{uploadedBy.FirstName} {uploadedBy.LastName}",
                IsImage = IsImageContentType(attachment.ContentType),
                FileIcon = GetFileIcon(attachment.ContentType)
            };
        }

        private string FormatFileSize(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        private bool IsImageContentType(string contentType)
        {
            return contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }

        private string GetFileIcon(string contentType)
        {
            return contentType.ToLowerInvariant() switch
            {
                var ct when ct.StartsWith("image/") => "fa-image",
                "application/pdf" => "fa-file-pdf",
                var ct when ct.Contains("word") => "fa-file-word",
                var ct when ct.Contains("excel") || ct.Contains("spreadsheet") => "fa-file-excel",
                var ct when ct.Contains("powerpoint") || ct.Contains("presentation") => "fa-file-powerpoint",
                "text/plain" => "fa-file-text",
                "text/csv" => "fa-file-csv",
                var ct when ct.Contains("zip") || ct.Contains("rar") => "fa-file-archive",
                _ => "fa-file"
            };
        }
    }
}
