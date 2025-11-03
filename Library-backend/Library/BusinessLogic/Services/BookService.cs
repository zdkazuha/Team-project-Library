using AutoMapper;
using BusinessLogic.Configurations.DTOs.BookDto;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class BookService : IBookService
    {
        private readonly LibraryDbContext _context;
        private readonly IMapper _mapper;

        public BookService(LibraryDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Get all books (with optional title filter)
        public async Task<IEnumerable<BookDto>> GetAllAsync(string? titleFilter = null)
        {
            var query = _context.Books
                .Include(b => b.Author)
                .Include(b => b.Genre)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(titleFilter))
            {
                query = query.Where(b => b.Title.Contains(titleFilter));
            }

            var books = await query.ToListAsync();
            return _mapper.Map<IEnumerable<BookDto>>(books);
        }

        // Get book by ID
        public async Task<BookDto?> GetByIdAsync(int id)
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Genre)
                .FirstOrDefaultAsync(b => b.Id == id);

            return book == null ? null : _mapper.Map<BookDto>(book);
        }

        // Create new book
        public async Task<BookDto> CreateAsync(BookDto bookDto)
        {
            var book = _mapper.Map<Book>(bookDto);
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return _mapper.Map<BookDto>(book);
        }

        // Update existing book
        public async Task<BookDto?> UpdateAsync(int id, BookDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return null;

            _mapper.Map(bookDto, book);
            await _context.SaveChangesAsync();

            return _mapper.Map<BookDto>(book);
        }

        // Delete book
        public async Task<bool> DeleteAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
