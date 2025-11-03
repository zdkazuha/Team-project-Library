using AutoMapper;
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

        // GET: api/Book?title=Title  
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAll([FromQuery] string? title = null)
        {
            var books = await _bookService.GetAllAsync(title);
            return Ok(books);
        }

        // GET: api/Book/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetById(int id)
        {
            var book = await _bookService.GetByIdAsync(id);
            if (book == null)
                return NotFound();

            return Ok(book);
        }

        // POST: api/Book
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BookDto>> Create([FromBody] BookDto bookDto)
        {
            var createdBook = await _bookService.CreateAsync(bookDto);
            return CreatedAtAction(nameof(GetById), new { id = createdBook.Id }, createdBook);
        }

        // PUT: api/Book/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BookDto>> Update(int id, [FromBody] BookDto bookDto)
        {
            var updatedBook = await _bookService.UpdateAsync(id, bookDto);
            if (updatedBook == null)
                return NotFound();

            return Ok(updatedBook);
        }

        // DELETE: api/Book/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _bookService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
