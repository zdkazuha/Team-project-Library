using BusinessLogic.Configurations.DTOs.WishlistDto;
using BusinessLogic.Interfaces;
using BusinessLogic.Services;
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

        [HttpGet]
        public async Task<IActionResult> GetAll(int pageNumber = 1)
        {
            var wishlists = await _wishlistService.GetAllAsync(pageNumber);
            return Ok(wishlists);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var wishlist = await _wishlistService.GetByIdAsync(id);
            if (wishlist == null) return NotFound();

            return Ok(wishlist);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateWishlistDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _wishlistService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPost("CreateByUserName")]
        public async Task<IActionResult> Create(int bookId, string userName)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _wishlistService.CreateAsync(bookId,userName);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWishlistDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _wishlistService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _wishlistService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [HttpDelete("DeleteByUsername")]
        public async Task<IActionResult> Delete(int bookId, string userName)
        {
            var deleted = await _wishlistService.DeleteAsync(bookId, userName);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [HttpGet("mywishlist")]
        public async Task<IActionResult> GetByUserWishlist(string userName)
        {
            var wishlists = await _wishlistService.GetByUserWishlistAsync(userName);
            return Ok(wishlists);
        }

        [HttpGet("isWishlist/{bookId}")]
        public async Task<IActionResult> IsWishlist(int bookId, string userName)
        {
            var isWishlist = await _wishlistService.isWishlist(bookId, userName);
            return Ok(isWishlist);
        }


    }
}
