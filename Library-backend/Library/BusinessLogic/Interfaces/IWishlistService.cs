using BusinessLogic.Configurations.DTOs.WishlistDto;

namespace BusinessLogic.Interfaces
{
    public interface IWishlistService
    {
        Task<IEnumerable<WishlistDto>> GetAllAsync(int pageNumber);
        Task<WishlistDto?> GetByIdAsync(int id);
        Task<WishlistDto> CreateAsync(CreateWishlistDto dto);
        Task<WishlistDto> CreateAsync(int bookId, string userName);
        Task<WishlistDto?> UpdateAsync(int id, UpdateWishlistDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(int bookId, string userName);
        Task<IEnumerable<WishlistDto>> GetByUserWishlistAsync(string userId);
        Task<bool> isWishlist(int bookId, string userId);
    }
}
