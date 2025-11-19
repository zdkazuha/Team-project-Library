using BusinessLogic.Configurations.DTOs.BookDto;
using BusinessLogic.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        // Getall (filtre)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? title, [FromQuery] string? search, int pageNumber = 1)
        {
            var searchTerm = !string.IsNullOrWhiteSpace(search) ? search : title;
            var books = await _bookService.GetAllAsync(searchTerm, pageNumber);
            return Ok(books);
        }

        // GetById
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var book = await _bookService.GetByIdAsync(id);
            if (book == null)
                return NotFound($"Book with id {id} not found.");

            return Ok(book);
        }

        // Create
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newBook = await _bookService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newBook.Id }, newBook);
        }

        // Update
        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBookDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _bookService.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound($"Book with id {id} not found.");

            return Ok(updated);
        }

        // delete
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _bookService.DeleteAsync(id);
            if (!success)
                return NotFound($"Book with id {id} not found.");

            return NoContent();
        }
    }
}
