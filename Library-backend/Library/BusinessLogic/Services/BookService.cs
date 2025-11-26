using AutoMapper;
using BusinessLogic.Configurations.DTOs.BookDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using System.Linq.Expressions;
using LinqKit;

namespace BusinessLogic.Services
{
    public class BookService : IBookService
    {
        private readonly IRepository<Book> _bookRepository;
        private readonly IMapper _mapper;

        public BookService(IRepository<Book> bookRepository, IMapper mapper)
        {
            _bookRepository = bookRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BookDto>> GetAllAsync(string? searchTerm = null, int pageNumber = 1)
        {
            var filters = PredicateBuilder.New<Book>(true);

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var normalized = searchTerm.Trim().ToLower();
                filters = filters.And(b =>
                    (b.Title != null && b.Title.ToLower().Contains(normalized)) ||
                    (b.Author != null && b.Author.Name.ToLower().Contains(normalized)) ||
                    (b.Genre != null && b.Genre.Name.ToLower().Contains(normalized))
                );
            }

            var books = await _bookRepository.GetAllAsync(
                pageNumber,
                pageSize: 10,
                filters,
                new[] { "Author", "Genre" }
            );

            return _mapper.Map<IEnumerable<BookDto>>(books);
        }

        public async Task<BookDto?> GetByIdAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id, "Author", "Genre");
            return book == null ? null : _mapper.Map<BookDto>(book);
        }

        public async Task<BookDto> CreateAsync(CreateBookDto dto)
        {
            var book = _mapper.Map<Book>(dto);
            await _bookRepository.AddAsync(book);
            return _mapper.Map<BookDto>(book);
        }

        public async Task<BookDto?> UpdateAsync(int id, UpdateBookDto dto)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return null;

            _mapper.Map(dto, book);
            await _bookRepository.UpdateAsync(book);

            return _mapper.Map<BookDto>(book);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null) return false;

            await _bookRepository.DeleteAsync(book);
            return true;
        }
    }
}
