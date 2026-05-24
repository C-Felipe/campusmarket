using Microsoft.AspNetCore.Mvc;
using CampusMarket.API.Services;
using CampusMarket.API.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace CampusMarket.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnunciosController : ControllerBase
    {
        private readonly IAnuncioService _service;

        public AnunciosController(IAnuncioService service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult Listar([FromQuery] string? categoria = null, [FromQuery] string? titulo = null)
        {
            var anuncios = _service.Listar(categoria, titulo);
            return Ok(anuncios);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult BuscarPorId(int id)
        {
            var anuncio = _service.BuscarPorId(id);
            return Ok(anuncio);
        }

        [Authorize]
        [HttpPost]
        public IActionResult Criar([FromBody] CriarAnuncioDto dto)
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            var anuncio = _service.Criar(dto, usuarioId);
            return CreatedAtAction(nameof(BuscarPorId), new { id = anuncio.Id }, anuncio);
        }

        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] CriarAnuncioDto dto)
        {
           var usuarioId = int.Parse(User.FindFirst("id")!.Value);
           var anuncio = _service.Atualizar(id, dto, usuarioId);
            return Ok(anuncio);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            _service.Deletar(id, usuarioId);
            return NoContent();
        }
    }
}