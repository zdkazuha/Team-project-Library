using AutoMapper;
using BusinessLogic.Configurations.DTOs.AuthorDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using LinqKit;
using System.Net;

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

        public async Task<IEnumerable<AuthorDto>> GetAllAsync(string? authorName, int pageNumber = 1)
        {
            var filters = PredicateBuilder.New<Author>(true);

            if (authorName != null)
                filters = filters.And(x => x.Name.Contains(authorName));

            var authors = await repo.GetAllAsync(pageNumber, 10, filters);

            if (authors == null)
                throw new HttpException("No authors found", HttpStatusCode.NotFound);

            return mapper.Map<IList<AuthorDto>>(authors);
        }

        public async Task<AuthorDto?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new HttpException("Id can`t be negative or zero.", HttpStatusCode.BadRequest);

            var author = await repo.GetByIdAsync(id);

            if (author == null)
                throw new HttpException("Author not found", HttpStatusCode.NotFound);

            return mapper.Map<AuthorDto>(author);
        }

        public async Task<AuthorDto> CreateAsync(CreateAuthorDto dto)
        {
            var author = mapper.Map<Author>(dto);

            await repo.AddAsync(author);

            return mapper.Map<AuthorDto>(author);
        }

        public async Task DeleteAsync(int id)
        {
            if (id <= 0)
                throw new HttpException("Id can`t be negative or zero.", HttpStatusCode.BadRequest);

            var author = await repo.GetByIdAsync(id);

            if (author == null)
                throw new HttpException("Author not found", HttpStatusCode.NotFound);

            await repo.DeleteAsync(author);
        }

        public async Task UpdateAsync(int id, UpdateAuthorDto dto)
        {
            var author = await repo.GetByIdAsync(id);

            if (author == null)
                throw new HttpException("Author not found", HttpStatusCode.NotFound);

            mapper.Map(dto, author);

            await repo.UpdateAsync(author);
        }
    }
}
