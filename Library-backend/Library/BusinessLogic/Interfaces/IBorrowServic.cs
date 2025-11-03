using BusinessLogic.Configurations.DTOs.BorrowDto;

namespace BusinessLogic.Interfaces
{
    public interface IBorrowService
    {
        Task<IEnumerable<BorrowDto>> GetAllAsync();
        Task<BorrowDto?> GetByIdAsync(int id);
        Task<BorrowDto> CreateAsync(CreateBorrowDto dto);
        Task<bool> UpdateAsync(int id, UpdateBorrowDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ReturnBookAsync(int id);
    }
}
