using BusinessLogic.Configurations.DTOs.BookDto;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessLogic.Services
{
    public class BookService : IBookService
    {
        private readonly LibraryDbContext _context;

        public BookService(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookDto>> GetAllAsync()
        {
            var books = await _context.Books.ToListAsync();

            return books.Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                CoverImage = b.CoverImage,
                PublishedDate = b.PublishedDate,
                AvailableCopies = b.AvailableCopies,
                AuthorId = b.AuthorId,
                GenreId = b.GenreId
            });
        }

        public async Task<BookDto?> GetByIdAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return null;

            return new BookDto
            {
                Id = book.Id,
                Title = book.Title,
                CoverImage = book.CoverImage,
                PublishedDate = book.PublishedDate,
                AvailableCopies = book.AvailableCopies,
                AuthorId = book.AuthorId,
                GenreId = book.GenreId
            };
        }

        public async Task<BookDto> CreateAsync(BookDto bookDto)
        {
            var book = new Book
            {
                Title = bookDto.Title,
                CoverImage = bookDto.CoverImage,
                PublishedDate = bookDto.PublishedDate,
                AvailableCopies = bookDto.AvailableCopies,
                AuthorId = bookDto.AuthorId,
                GenreId = bookDto.GenreId
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            bookDto.Id = book.Id;
            return bookDto;
        }

        public async Task<BookDto?> UpdateAsync(int id, BookDto bookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return null;

            book.Title = bookDto.Title;
            book.CoverImage = bookDto.CoverImage;
            book.PublishedDate = bookDto.PublishedDate;
            book.AvailableCopies = bookDto.AvailableCopies;
            book.AuthorId = bookDto.AuthorId;
            book.GenreId = bookDto.GenreId;

            await _context.SaveChangesAsync();

            return bookDto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return false;

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
