using Microsoft.EntityFrameworkCore;

namespace DataAccess.Helpers
{
    public static class IQuerayableExtensions
    {
        public static async Task<IQueryable<T>> PaginateAsync<T>(this IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            return source.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }
    }
}
