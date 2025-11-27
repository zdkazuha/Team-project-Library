using BusinessLogic.Configurations.DTOs.WishlistDto;
using BusinessLogic.Interfaces;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll(int pageNumber = 1)
        {
            var wishlists = await _wishlistService.GetAllAsync(pageNumber);
            return Ok(wishlists);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var wishlist = await _wishlistService.GetByIdAsync(id);
            if (wishlist == null) return NotFound();

            return Ok(wishlist);
        }

        [Authorize]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateWishlistDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _wishlistService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize]
        [HttpPost("CreateByUserName")]
        public async Task<IActionResult> CreateByUserName([FromQuery] int bookId, [FromQuery] string userId)
        {
            var created = await _wishlistService.CreateAsync(bookId, userId);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWishlistDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _wishlistService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _wishlistService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [Authorize]
        [HttpDelete("DeleteByUsername")]
        public async Task<IActionResult> Delete(int bookId, string userId)
        {
            var deleted = await _wishlistService.DeleteAsync(bookId, userId);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [Authorize]
        [HttpGet("mywishlist")]
        public async Task<IActionResult> GetByUserWishlist(string userId)
        {
            var wishlists = await _wishlistService.GetByUserWishlistAsync(userId);
            return Ok(wishlists);
        }

        [Authorize]
        [HttpGet("isWishlist/{bookId}")]
        public async Task<IActionResult> IsWishlist(int bookId, string userId)
        {
            var isWishlist = await _wishlistService.isWishlist(bookId, userId);
            return Ok(isWishlist);
        }
    }
}
