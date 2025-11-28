using AutoMapper;
using BusinessLogic.Configurations.DTOs.WishlistDto;
using BusinessLogic.Interfaces;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using LinqKit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace BusinessLogic.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IRepository<Wishlist> _wishlistRepository;
        private readonly IMapper _mapper;

        public WishlistService(IRepository<Wishlist> wishlistRepository, IMapper mapper)
        {
            _wishlistRepository = wishlistRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<WishlistDto>> GetAllAsync(int pageNumber = 1)
        {
            var wishlists = await _wishlistRepository.GetAllAsync(pageNumber, 10, includes: ["Book", "User"]);
            return _mapper.Map<IEnumerable<WishlistDto>>(wishlists);
        }

        public async Task<WishlistDto?> GetByIdAsync(int id)
        {
            var wishlist = await _wishlistRepository.GetByIdAsync(id);
            return wishlist == null ? null : _mapper.Map<WishlistDto>(wishlist);
        }

        public async Task<WishlistDto> CreateAsync(CreateWishlistDto dto)
        {
            var entity = _mapper.Map<Wishlist>(dto);
            await _wishlistRepository.AddAsync(entity);
            return _mapper.Map<WishlistDto>(entity);
        }

        public async Task<WishlistDto> CreateAsync(int bookId, string userId)
        {
            var dto = new CreateWishlistDto
            {
                BookId = bookId,
                UserId = userId
            };

            var entity = _mapper.Map<Wishlist>(dto);
            await _wishlistRepository.AddAsync(entity);
            return _mapper.Map<WishlistDto>(entity);
        }

        public async Task<WishlistDto?> UpdateAsync(int id, UpdateWishlistDto dto)
        {
            var entity = await _wishlistRepository.GetByIdAsync(id);
            if (entity == null) return null;

            _mapper.Map(dto, entity);
            await _wishlistRepository.UpdateAsync(entity);
            return _mapper.Map<WishlistDto>(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _wishlistRepository.GetByIdAsync(id);
            if (entity == null) return false;

            await _wishlistRepository.DeleteAsync(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(int bookId, string userId)
        {
            var filters = PredicateBuilder.New<Wishlist>(true);

            var entities = await _wishlistRepository.GetAllAsync(
                1,
                10,
                filters.And(w => w.BookId == bookId && w.UserId == userId),
                "Book", "User"
            );

            if (entities.Count == 0)
                return false;

            var entity = entities[0];

            await _wishlistRepository.DeleteAsync(entity);
            return true;
        }

        public async Task<IEnumerable<WishlistDto>> GetByUserWishlistAsync(string userId)
        {
            var wishlists = await _wishlistRepository.GetAllAsync(
                pageNumber: 1,
                pageSize: 10,
                filtering: w => w.UserId == userId,
                includes: nameof(Borrow.Book)
            );

            return _mapper.Map<IEnumerable<WishlistDto>>(wishlists);
        }

        public async Task<bool> isWishlist(int bookId, string userId)
        {
            var filters = PredicateBuilder.New<Wishlist>(true);

            var wishlists = await _wishlistRepository.GetAllAsync(
                pageNumber: 1,
                pageSize: 10,
                filtering: filters.And(w => w.BookId == bookId && w.UserId == userId),
                includes: nameof(Borrow.Book)
                );

            return wishlists.Any();
        }
    }
}
