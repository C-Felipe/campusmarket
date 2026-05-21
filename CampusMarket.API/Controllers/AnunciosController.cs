using Microsoft.AspNetCore.Mvc;
using CampusMarket.API.Services;
using CampusMarket.API.DTOs;
using CampusMarket.API.Exceptions;
using Microsoft.AspNetCore.Authorization;

namespace CampusMarket.API.Controllers
{
    [Authorize] //só entra aqui quem tiver token, senão toma 401
    [ApiController]
    [Route("api/[controller]")]
    public class AnunciosController : ControllerBase
    {
        private readonly IAnuncioService _service;

        public AnunciosController(IAnuncioService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult Listar()
        {
            var anuncios = _service.Listar();
            return Ok(anuncios);
        }

        [HttpGet("{id}")]
        public IActionResult BuscarPorId(int id)
        {
            var anuncio = _service.BuscarPorId(id);
            return Ok(anuncio);
        }

        [HttpPost]
        public IActionResult Criar([FromBody] CriarAnuncioDto dto)
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            var anuncio = _service.Criar(dto, usuarioId);
            return CreatedAtAction(nameof(BuscarPorId), new { id = anuncio.Id }, anuncio);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] CriarAnuncioDto dto)
        {
           var anuncio = _service.Atualizar(id, dto);
            return Ok(anuncio);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            _service.Deletar(id);
            return NoContent();
        }
    }
}