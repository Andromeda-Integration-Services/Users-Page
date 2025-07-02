using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly ILogger<FileStorageService> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadsPath;

        // Allowed file types for security
        private readonly HashSet<string> _allowedContentTypes = new()
        {
            // Images
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp",
            // Documents
            "application/pdf", "application/msword", 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            // Text files
            "text/plain", "text/csv",
            // Archives
            "application/zip", "application/x-rar-compressed"
        };

        // Maximum file size: 10MB
        private const long MaxFileSize = 10 * 1024 * 1024;

        public FileStorageService(ILogger<FileStorageService> logger, IWebHostEnvironment environment)
        {
            _logger = logger;
            _environment = environment;
            _uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", "tickets");
            
            // Ensure uploads directory exists
            Directory.CreateDirectory(_uploadsPath);
        }

        public async Task<string> SaveFileAsync(IFormFile file, int ticketId, string uploadedById)
        {
            try
            {
                if (file == null || file.Length == 0)
                    throw new ArgumentException("File is empty or null");

                if (!IsValidFileType(file.ContentType))
                    throw new ArgumentException($"File type '{file.ContentType}' is not allowed");

                if (!IsValidFileSize(file.Length))
                    throw new ArgumentException($"File size exceeds maximum allowed size of {MaxFileSize / (1024 * 1024)}MB");

                // Create ticket-specific directory
                var ticketDirectory = Path.Combine(_uploadsPath, ticketId.ToString());
                Directory.CreateDirectory(ticketDirectory);

                // Generate unique filename
                var uniqueFileName = GenerateUniqueFileName(file.FileName, ticketId);
                var filePath = Path.Combine(ticketDirectory, uniqueFileName);

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                _logger.LogInformation("File saved successfully: {FilePath} for ticket {TicketId} by user {UserId}", 
                    filePath, ticketId, uploadedById);

                // Return relative path for database storage
                return Path.Combine("tickets", ticketId.ToString(), uniqueFileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file for ticket {TicketId}", ticketId);
                throw;
            }
        }

        public async Task<(byte[] fileData, string contentType, string fileName)> GetFileAsync(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(_uploadsPath, "..", filePath);
                
                if (!File.Exists(fullPath))
                    throw new FileNotFoundException("File not found");

                var fileData = await File.ReadAllBytesAsync(fullPath);
                var fileName = Path.GetFileName(fullPath);
                
                // Determine content type based on file extension
                var contentType = GetContentTypeFromExtension(Path.GetExtension(fileName));

                return (fileData, contentType, fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving file: {FilePath}", filePath);
                throw;
            }
        }

        public async Task<bool> DeleteFileAsync(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(_uploadsPath, "..", filePath);
                
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    _logger.LogInformation("File deleted successfully: {FilePath}", filePath);
                    return true;
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file: {FilePath}", filePath);
                return false;
            }
        }

        public bool IsValidFileType(string contentType)
        {
            return _allowedContentTypes.Contains(contentType.ToLowerInvariant());
        }

        public bool IsValidFileSize(long fileSize)
        {
            return fileSize > 0 && fileSize <= MaxFileSize;
        }

        public string GetFileExtension(string fileName)
        {
            return Path.GetExtension(fileName).ToLowerInvariant();
        }

        public string GenerateUniqueFileName(string originalFileName, int ticketId)
        {
            var extension = GetFileExtension(originalFileName);
            var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
            var guid = Guid.NewGuid().ToString("N")[..8]; // First 8 characters of GUID
            
            return $"ticket_{ticketId}_{timestamp}_{guid}{extension}";
        }

        private string GetContentTypeFromExtension(string extension)
        {
            return extension.ToLowerInvariant() switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                ".webp" => "image/webp",
                ".pdf" => "application/pdf",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xls" => "application/vnd.ms-excel",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".ppt" => "application/vnd.ms-powerpoint",
                ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ".txt" => "text/plain",
                ".csv" => "text/csv",
                ".zip" => "application/zip",
                ".rar" => "application/x-rar-compressed",
                _ => "application/octet-stream"
            };
        }
    }
}
