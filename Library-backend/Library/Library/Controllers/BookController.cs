using AutoMapper;
using BusinessLogic.Configurations.DTOs.BookDto;
using DataAccess.Data.Entities;
using DataAccess.Repositories;
using DataAccess.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly IRepository<Book> _bookRepository;
        private readonly IMapper _mapper;

        public BookController(IRepository<Book> bookRepository, IMapper mapper)
        {
            _bookRepository = bookRepository;
            _mapper = mapper;
        }

        // GET: api/book
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAll()
        {
            var books = await _bookRepository.GetAllAsync();
            var bookDtos = _mapper.Map<IEnumerable<BookDto>>(books);
            return Ok(bookDtos);
        }

        // GET: api/book/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetById(int id)
        {
            var book = await _bookRepository.GetByIdAsync(id);
            if (book == null)
                return NotFound($"Book with id={id} not found.");

            var bookDto = _mapper.Map<BookDto>(book);
            return Ok(bookDto);
        }

        // POST: api/book
        [HttpPost]
        public async Task<ActionResult<BookDto>> Create([FromBody] CreateBookDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var book = _mapper.Map<Book>(dto);
            await _bookRepository.AddAsync(book);

            var createdDto = _mapper.Map<BookDto>(book);
            return CreatedAtAction(nameof(GetById), new { id = book.Id }, createdDto);
        }

        // PUT: api/book/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBookDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingBook = await _bookRepository.GetByIdAsync(id);
            if (existingBook == null)
                return NotFound($"Book with id={id} not found.");

            _mapper.Map(dto, existingBook);
            await _bookRepository.UpdateAsync(existingBook);

            return NoContent();
        }

        // DELETE: api/book/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingBook = await _bookRepository.GetByIdAsync(id);
            if (existingBook == null)
                return NotFound($"Book with id={id} not found.");

            await _bookRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
