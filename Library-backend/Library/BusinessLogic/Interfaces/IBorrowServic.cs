using BusinessLogic.Configurations.DTOs.BorrowDto;

namespace BusinessLogic.Interfaces
{
    public interface IBorrowService
    {
        Task<IEnumerable<BorrowDto>> GetAllAsync(int pageNumber = 1);
        Task<BorrowDto?> GetByIdAsync(int id);
        Task<BorrowDto> CreateAsync(CreateBorrowDto dto);
        Task<bool> ReturnBookAsync(int bookId, string userId);
        Task<bool> UpdateAsync(int id, UpdateBorrowDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> CheckBookAvailabilityAsync(int bookId);
        Task<IEnumerable<BorrowDto>> GetUserBorrowsAsync(string userId);
        Task<IEnumerable<BorrowDto>> GetUserBorrowsReturnedAsync(string userId);
        Task<bool> isBorrow(int bookId, string userId);
    }
}
