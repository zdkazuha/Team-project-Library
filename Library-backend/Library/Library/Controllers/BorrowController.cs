using BusinessLogic.Configurations.DTOs.BorrowDto;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowController : ControllerBase
    {
        private readonly IBorrowService _borrowService;

        public BorrowController(IBorrowService borrowService)
        {
            _borrowService = borrowService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll(int pageNumber = 1)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var borrows = await _borrowService.GetAllAsync(pageNumber);

            if (!isAdmin)
                borrows = borrows.Where(b => b.UserId == userId);

            return Ok(borrows);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var borrow = await _borrowService.GetByIdAsync(id);
            if (borrow == null)
                return NotFound();

            if (!isAdmin && borrow.UserId != userId)
                return Forbid();

            return Ok(borrow);
        }

        [Authorize]
        [HttpPost("borrow")]
        public async Task<IActionResult> BorrowBook(CreateBorrowDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (!isAdmin)
                dto.UserId = userId;

            var borrow = await _borrowService.CreateAsync(dto);
            return Ok(borrow);
        }

        [Authorize]
        [HttpPut("return")]
        public async Task<IActionResult> ReturnBook(int bookId, string userId)
        {
            //var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            //var isAdmin = User.IsInRole("Admin");

            //var borrow = await _borrowService.GetByIdAsync(id);
            //if (borrow == null)
            //    return NotFound();

            //if (!isAdmin && borrow.UserId != userId)
            //    return Forbid();

            var success = await _borrowService.ReturnBookAsync(bookId, userId);
            return success ? NoContent() : NotFound();
        }

        [Authorize]
        [HttpGet("check-status/{bookId}")]
        public async Task<IActionResult> CheckBookStatus(int bookId)
        {
            var available = await _borrowService.CheckBookAvailabilityAsync(bookId);
            return Ok(new { bookId, available });
        }

        [Authorize]
        [HttpGet("mybooks")]
        public async Task<IActionResult> GetMyBooks(string userId)
        {
            var books = await _borrowService.GetUserBorrowsAsync(userId);
            return Ok(books);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateBorrowDto dto)
        {
            var success = await _borrowService.UpdateAsync(id, dto);
            return success ? NoContent() : NotFound();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _borrowService.DeleteAsync(id);
            return success ? NoContent() : NotFound();
        }

        [Authorize]
        [HttpGet("isBorrow/{bookId}")]
        public async Task<IActionResult> IsBorrow(int bookId, string userId)
        {
            var isBorrowed = await _borrowService.isBorrow(bookId, userId);
            return Ok(isBorrowed);
        }
    }
}
