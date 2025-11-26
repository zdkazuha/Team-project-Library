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

        //[Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllHistory(int pageNumber = 1)
        {
            var borrows = await _borrowService.GetAllAsync(pageNumber);
            var returned = borrows.Where(b => b.ReturnedAt != null).ToList();
            return Ok(returned);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserHistory(string userId)
        {
            var borrows = await _borrowService.GetUserBorrowsReturnedAsync(userId);

            //var returned = borrows.Where(b => b.ReturnedAt != null).ToList();

            return Ok(borrows);
        }
    }
}
