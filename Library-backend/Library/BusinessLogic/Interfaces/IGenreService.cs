using BusinessLogic.Configurations.DTOs.GenreDto;

namespace BusinessLogic.Interfaces
{
    public interface IGenreService
    {
        Task<IEnumerable<GenreDto>> GetAllAsync(string? genreName, int pageNumber);
        Task<GenreDto?> GetByIdAsync(int id);
        Task<GenreDto> CreateAsync(CreateGenreDto dto);
        Task UpdateAsync(int id, UpdateGenreDto dto);
        Task DeleteAsync(int id);
    }
}
