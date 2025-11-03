using AutoMapper;
using BusinessLogic.Configurations.DTOs.BorrowDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<BorrowDto>> GetAllAsync()
        {
            var borrows = await _borrowRepository.GetAllAsync(
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

        public async Task<bool> ReturnBookAsync(int id)
        {
            var borrow = await _borrowRepository.GetByIdAsync(
                id,
                includes: new[] { nameof(Borrow.Book) }
            );

            if (borrow == null)
                return false;

            if (borrow.ReturnedAt != default)
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

            if (borrow.ReturnedAt == default)
            {
                borrow.Book.AvailableCopies += 1;
                await _bookRepository.UpdateAsync(borrow.Book);
            }

            await _borrowRepository.DeleteAsync(borrow);
            return true;
        }
    }
}
