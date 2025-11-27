using DataAccess.Data.Entities;
using System.Linq.Expressions;

namespace DataAccess.Repositories
{
    public interface IRepository<T> where T : class, BaseEntity
    {
        Task<IReadOnlyList<T>> GetAllAsync(
            int? pageNumber = null,
            int pageSize = 10,
            Expression<Func<T, bool>>? filtering = null,
            params string[]? includes
            );
        Task<T?> GetByIdAsync(int id, params string[]? includes);
        Task<T?> GetByIdAsync(string id, params string[]? includes);
        Task AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
        Task DeleteAsync(T? entity);
    }
}