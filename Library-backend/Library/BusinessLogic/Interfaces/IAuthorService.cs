using BusinessLogic.Configurations.DTOs.AuthorDto;

namespace BusinessLogic.Interfaces
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDto>> GetAll(string? authorName, int pageNumber);

        Task<AuthorDto> GetById(int id);

        Task<AuthorDto> Create(CreateAuthorDto dto);

        Task Update(int id, UpdateAuthorDto dto);

        Task Delete(int id);
    }
}
