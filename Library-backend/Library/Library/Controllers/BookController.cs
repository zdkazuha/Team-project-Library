using BusinessLogic.Configurations.DTOs.BookDto;
using DataAccess.Data;
using DataAccess.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly LibraryDbContext _context;

        public BookController(LibraryDbContext context)
        {
            _context = context;
        }

        // GET
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks()
        {
            var books = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Genre)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    CoverImage = b.CoverImage,
                    PublishedDate = b.PublishedDate,
                    AvailableCopies = b.AvailableCopies,
                    AuthorId = b.AuthorId,
                    GenreId = b.GenreId
                })
                .ToListAsync();

            return Ok(books);
        }

        // GET (id)
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.Author)
                .Include(b => b.Genre)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
                return NotFound();

            return Ok(new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                CoverImage = book.CoverImage,
                PublishedDate = book.PublishedDate,
                AvailableCopies = book.AvailableCopies,
                AuthorId = book.AuthorId,
                GenreId = book.GenreId
            });
        }

        // POST
        [HttpPost]
        public async Task<ActionResult<Book>> CreateBook([FromBody] BookDto dto)
        {
            var book = new Book
            {
                Title = dto.Title,
                CoverImage = dto.CoverImage,
                PublishedDate = dto.PublishedDate,
                AvailableCopies = dto.AvailableCopies,
                AuthorId = dto.AuthorId,
                GenreId = dto.GenreId
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookDto dto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            book.Title = dto.Title;
            book.CoverImage = dto.CoverImage;
            book.PublishedDate = dto.PublishedDate;
            book.AvailableCopies = dto.AvailableCopies;
            book.AuthorId = dto.AuthorId;
            book.GenreId = dto.GenreId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
                return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
