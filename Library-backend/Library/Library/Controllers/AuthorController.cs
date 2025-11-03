using BusinessLogic.Configurations.DTOs.AuthorDto;
using BusinessLogic.Interfaces;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Library.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService authorService;

        public AuthorController(IAuthorService authorService)
        {
            this.authorService = authorService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll(string? authorName, int pageNumber = 1)
        {
            var authors = await authorService.GetAllAsync(authorName, pageNumber);

            return Ok(authors);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var author = await authorService.GetByIdAsync(id);

            return Ok(author);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(CreateAuthorDto dto)
        {
            var author = await authorService.CreateAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = author.Id }, author);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, UpdateAuthorDto dto)
        {
            await authorService.UpdateAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            await authorService.DeleteAsync(id);
            return NoContent();
        }

    }
}
