using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly IBorrowService _borrowService;

        public HistoryController(IBorrowService borrowService)
        {
            _borrowService = borrowService;
        }

        //Отримати історію оренд для всіх користувачів (лише Admin)
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllHistory()
        {
            var borrows = await _borrowService.GetAllAsync();
            var returned = borrows.Where(b => b.ReturnedAt != null).ToList();
            return Ok(returned);
        }

        //Отримати історію оренд поточного користувача
        [AllowAnonymous] //поки без авторизації — для фронту
        [HttpGet]
        public async Task<IActionResult> GetUserHistory(string userName)
        {
            var borrows = await _borrowService.GetUserBorrowsAsync(userName);

            //Фільтруємо лише повернені книги
            var returned = borrows.Where(b => b.ReturnedAt != null).ToList();

            // Не кидаємо 404 — навіть якщо порожній список
            return Ok(returned);
        }
    }
}
