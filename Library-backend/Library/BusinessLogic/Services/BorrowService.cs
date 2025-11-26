using AutoMapper;
using BusinessLogic.Configurations.DTOs.BorrowDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using LinqKit;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace BusinessLogic.Services
{
    public class BorrowService : IBorrowService
    {
        private readonly IRepository<Borrow> _borrowRepository;
        private readonly IRepository<Book> _bookRepository;
        private readonly IMapper _mapper;

        public BorrowService(IRepository<Borrow> borrowRepository, IRepository<Book> bookRepository, IMapper mapper)
        {
            _borrowRepository = borrowRepository;
            _bookRepository = bookRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<BorrowDto>> GetAllAsync(int pageNumber = 1)
        {
            var borrows = await _borrowRepository.GetAllAsync(
                pageNumber,
                10,
                includes: new[] { nameof(Borrow.Book), nameof(Borrow.User) }
            );

            return _mapper.Map<IEnumerable<BorrowDto>>(borrows);
        }

        public async Task<BorrowDto?> GetByIdAsync(int id)
        {
            var borrow = await _borrowRepository.GetByIdAsync(
                id,
                includes: new[] { nameof(Borrow.Book), nameof(Borrow.User) }
            );

            return borrow == null ? null : _mapper.Map<BorrowDto>(borrow);
        }

        public async Task<BorrowDto> CreateAsync(CreateBorrowDto dto)
        {
            var book = await _bookRepository.GetByIdAsync(dto.BookId);
            if (book == null)
                throw new Exception("Book not found.");

            if (book.AvailableCopies <= 0)
                throw new Exception("No available copies for this book.");

            var userActiveBorrow = await _borrowRepository.GetAllAsync(
                filtering: b => b.BookId == dto.BookId && b.UserId == dto.UserId && b.ReturnedAt == null
            );

            if (userActiveBorrow.Any())
                throw new Exception("You have already borrowed this book and not returned it yet.");

            var borrow = new Borrow
            {
                BookId = dto.BookId,
                UserId = dto.UserId,
                BorrowedAt = dto.BorrowedAt == default ? DateTime.UtcNow : dto.BorrowedAt,
                DueDate = dto.DueDate == default ? DateTime.UtcNow.AddDays(14) : dto.DueDate
            };

            book.AvailableCopies -= 1;
            await _bookRepository.UpdateAsync(book);
            await _borrowRepository.AddAsync(borrow);

            return _mapper.Map<BorrowDto>(borrow);
        }

        public async Task<bool> ReturnBookAsync(int bookId, string userId)
        {
            var borrows = await _borrowRepository.GetAllAsync(
                pageNumber: 1,
                pageSize: 1,
                filtering: b => b.BookId == bookId && b.UserId == userId && b.ReturnedAt == null,
                includes: new[] { nameof(Borrow.Book) }
            );

            if (!borrows.Any())
                return false;

            var borrow = borrows.First();

            if (borrow.ReturnedAt != null)
                throw new Exception("Book already returned.");

            borrow.ReturnedAt = DateTime.UtcNow;
            borrow.Book.AvailableCopies += 1;

            await _bookRepository.UpdateAsync(borrow.Book);
            await _borrowRepository.UpdateAsync(borrow);

            return true;
        }

        public async Task<bool> UpdateAsync(int id, UpdateBorrowDto dto)
        {
            var borrow = await _borrowRepository.GetByIdAsync(id);
            if (borrow == null)
                return false;

            _mapper.Map(dto, borrow);
            await _borrowRepository.UpdateAsync(borrow);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var borrow = await _borrowRepository.GetByIdAsync(
                id,
                includes: new[] { nameof(Borrow.Book) }
            );

            if (borrow == null)
                return false;

            if (borrow.ReturnedAt == null)
            {
                borrow.Book.AvailableCopies += 1;
                await _bookRepository.UpdateAsync(borrow.Book);
            }

            await _borrowRepository.DeleteAsync(borrow);
            return true;
        }

        public async Task<bool> CheckBookAvailabilityAsync(int bookId)
        {
            var book = await _bookRepository.GetByIdAsync(bookId);
            if (book == null)
                throw new Exception("Book not found.");

            return book.AvailableCopies > 0;
        }

        public async Task<IEnumerable<BorrowDto>> GetUserBorrowsAsync(string userId)
        {
            var borrows = await _borrowRepository.GetAllAsync(
                filtering: b => b.UserId == userId && b.ReturnedAt == null,
                includes: new[] { nameof(Borrow.Book) }
            );

            return _mapper.Map<IEnumerable<BorrowDto>>(borrows);
        }

        public async Task<IEnumerable<BorrowDto>> GetUserBorrowsReturnedAsync(string userId)
        {
            var borrows = await _borrowRepository.GetAllAsync(
                filtering: b => b.UserId == userId && b.ReturnedAt != null,
                includes: new[] { nameof(Borrow.Book) }
            );

            return _mapper.Map<IEnumerable<BorrowDto>>(borrows);
        }

        public async Task<bool> isBorrow(int bookId, string userId)
        {
            var filters = PredicateBuilder.New<Borrow>(true);

            var wishlists = await _borrowRepository.GetAllAsync(
                1,
                10,
                filtering: filters.And(w => w.BookId == bookId && w.UserId == userId),
                "Book", "User"
                );

            return wishlists.Any();
        }
    }
}   
