using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveFileAsync(IFormFile file, int ticketId, string uploadedById);
        Task<(byte[] fileData, string contentType, string fileName)> GetFileAsync(string filePath);
        Task<bool> DeleteFileAsync(string filePath);
        bool IsValidFileType(string contentType);
        bool IsValidFileSize(long fileSize);
        string GetFileExtension(string fileName);
        string GenerateUniqueFileName(string originalFileName, int ticketId);
    }
}
