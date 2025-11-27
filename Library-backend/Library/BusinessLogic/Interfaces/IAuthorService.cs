using BusinessLogic.Configurations.DTOs.AuthorDto;

namespace BusinessLogic.Interfaces
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDto>> GetAllAsync(string? authorName, int pageNumber);
        Task<AuthorDto?> GetByIdAsync(int id);
        Task<AuthorDto> CreateAsync(CreateAuthorDto dto);
        Task UpdateAsync(int id, UpdateAuthorDto dto);
        Task DeleteAsync(int id);
    }
}
