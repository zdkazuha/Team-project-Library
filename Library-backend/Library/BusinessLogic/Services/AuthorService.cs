using AutoMapper;
using BusinessLogic.Configurations.DTOs.AuthorDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using LinqKit;

namespace BusinessLogic.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly IRepository<Author> repo;
        private readonly IMapper mapper;

        public AuthorService(IRepository<Author> repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }

        public async Task<AuthorDto> Create(CreateAuthorDto dto)
        {
            var author = mapper.Map<Author>(dto);

            await repo.AddAsync(author);

            return mapper.Map<AuthorDto>(author);
        }

        public async Task Delete(int id)
        {
            if (id <= 0)
                throw new Exception("Invalid author id");

            var author = await repo.GetByIdAsync(id);

            if (author == null)
                throw new Exception("Author not found");

            await repo.DeleteAsync(author);
        }

        public async Task<IEnumerable<AuthorDto>> GetAll(string? authorName, int pageNumber)
        {
            var filters = PredicateBuilder.New<Author>(true);

            if (authorName != null)
                filters = filters.And(x => x.Name.Contains(authorName));

            var authors = await repo.GetAllAsync(pageNumber, 10, filters);

            if (authors == null)
                throw new Exception("No authors found");

            return mapper.Map<IList<AuthorDto>>(authors);
        }

        public async Task<AuthorDto> GetById(int id)
        {
            if (id <= 0)
                throw new Exception("Invalid author id");

            var author = await repo.GetByIdAsync(id);

            if (author == null)
                throw new Exception("Author not found");

            return mapper.Map<AuthorDto>(author);
        }

        public async Task Update(int id, UpdateAuthorDto dto)
        {
            var author = await repo.GetByIdAsync(id);

            if (author == null)
                throw new Exception("Author not found");

            mapper.Map(dto, author);

            await repo.UpdateAsync(author);
        }
    }
}
