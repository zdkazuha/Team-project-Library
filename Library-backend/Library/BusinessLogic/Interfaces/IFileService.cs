using Microsoft.AspNetCore.Http;

namespace BusinessLogic.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveImage(IFormFile file);
        Task<string> UpdateImage(string path, IFormFile file);
        Task DeleteImage(string path);
    }
}