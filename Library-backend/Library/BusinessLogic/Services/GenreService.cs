using AutoMapper;
using BusinessLogic.Configurations.DTOs.GenreDto;
using BusinessLogic.Configurations.DTOs.ReviewDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using LinqKit;
using System.Net;

namespace BusinessLogic.Services
{
    public class GenreService : IGenreService
    {
        private readonly IRepository<Genre> repo;
        private readonly IMapper mapper;

        public GenreService(IRepository<Genre> repo, IMapper mapper)
        {
            this.repo = repo;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<GenreDto>> GetAllAsync(string? genreName, int pageNumber = 1)
        {
            var filters = PredicateBuilder.New<Genre>(true);

            if (genreName != null)
                filters = filters.And(x => x.Name.Contains(genreName));

            var genres = await repo.GetAllAsync(pageNumber, 10, filters);

            if (genres == null)
                throw new HttpException("Genres not found.", HttpStatusCode.NotFound);

            return mapper.Map<IEnumerable<GenreDto>>(genres);
        }

        public async Task<GenreDto?> GetByIdAsync(int id)
        {
            if (id <= 0)
                throw new HttpException("Id can`t be negative or zero.", HttpStatusCode.BadRequest);

            var genre = await repo.GetByIdAsync(id);

            if (genre == null)
                throw new HttpException("Genre not found.", HttpStatusCode.NotFound);

            return mapper.Map<GenreDto>(genre);
        }

        public async Task<GenreDto> CreateAsync(CreateGenreDto dto)
        {
            var genre = mapper.Map<Genre>(dto);

            await repo.AddAsync(genre);

            return mapper.Map<GenreDto>(genre);
        }

        public async Task UpdateAsync(int id, UpdateGenreDto dto)
        {
            if (id <= 0)
                throw new HttpException("Id can`t be negative or zero.", HttpStatusCode.BadRequest);

            var genre = await repo.GetByIdAsync(id);

            if (genre == null)
                throw new HttpException("Genre not found.", HttpStatusCode.NotFound);

            mapper.Map(dto, genre);

            await repo.UpdateAsync(genre);
        }

        public async Task DeleteAsync(int id)
        {
            if(id <= 0)
                throw new HttpException("Id can`t be negative or zero.", HttpStatusCode.BadRequest);

            var genre = await repo.GetByIdAsync(id);

            if (genre == null)
                throw new HttpException("Genre not found.", HttpStatusCode.NotFound);

            await repo.DeleteAsync(id);
        }
    }
}
