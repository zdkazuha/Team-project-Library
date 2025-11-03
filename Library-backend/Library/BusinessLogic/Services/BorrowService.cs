using AutoMapper;
using BusinessLogic.Configurations.DTOs.BorrowDto;
using BusinessLogic.Interfaces;
using DataAccess.Data;
using DataAccess.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services
{
    public class BorrowService : IBorrowService
    {
        private readonly LibraryDbContext _context;
        private readonly IMapper _mapper;

        public BorrowService(LibraryDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BorrowDto>> GetAllAsync()
        {
            var borrows = await _context.Borrows
                .Include(b => b.Book)
                .Include(b => b.User)
                .ToListAsync();

            return _mapper.Map<IEnumerable<BorrowDto>>(borrows);
        }

        public async Task<BorrowDto?> GetByIdAsync(int id)
        {
            var borrow = await _context.Borrows
                .Include(b => b.Book)
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == id);

            return borrow == null ? null : _mapper.Map<BorrowDto>(borrow);
        }

        public async Task<BorrowDto> CreateAsync(CreateBorrowDto dto)
        {
            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null)
                throw new Exception("Book not found.");

            if (book.AvailableCopies <= 0)
                throw new Exception("No available copies for this book.");

            var borrow = new Borrow
            {
                BookId = dto.BookId,
                UserId = dto.UserId,
                BorrowedAt = dto.BorrowedAt == default ? DateTime.UtcNow : dto.BorrowedAt,
                DueDate = dto.DueDate == default ? DateTime.UtcNow.AddDays(14) : dto.DueDate
            };

            book.AvailableCopies -= 1; 
            _context.Borrows.Add(borrow);
            await _context.SaveChangesAsync();

            return _mapper.Map<BorrowDto>(borrow);
        }

        public async Task<bool> ReturnBookAsync(int id)
        {
            var borrow = await _context.Borrows
                .Include(b => b.Book)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (borrow == null)
                return false;

            borrow.ReturnedAt = DateTime.UtcNow;
            borrow.Book.AvailableCopies += 1; 

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(int id, UpdateBorrowDto dto)
        {
            var borrow = await _context.Borrows.FindAsync(id);
            if (borrow == null)
                return false;

            _mapper.Map(dto, borrow);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var borrow = await _context.Borrows
                .Include(b => b.Book)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (borrow == null)
                return false;

            if (borrow.ReturnedAt == default)
                borrow.Book.AvailableCopies += 1;

            _context.Borrows.Remove(borrow);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
