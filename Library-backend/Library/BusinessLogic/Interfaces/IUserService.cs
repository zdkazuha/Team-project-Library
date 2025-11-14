using BusinessLogic.Configurations.DTOs.UserDto;
using BusinessLogic.DTOs.Auth;

namespace BusinessLogic.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto?> GetByIdAsync(string id);
        Task<UserDto?> GetByUsernameAsync(string username);
        Task<UserDto> CreateAsync(CreateUserDto dto);
        Task<bool> UpdateAsync(string id, UpdateUserDto dto);
        Task<bool> DeleteAsync(string id);
        Task<string?> RegisterAsync(RegisterDto dto);
        Task<string?> LoginAsync(LoginDto dto);
    }
}
