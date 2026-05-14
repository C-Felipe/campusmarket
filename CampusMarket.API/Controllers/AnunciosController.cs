using Microsoft.AspNetCore.Mvc;
using CampusMarket.API.Services;
using CampusMarket.API.DTOs;
using CampusMarket.API.Exceptions;

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

        [HttpGet]
        public IActionResult Listar()
        {
            var anuncios = _service.Listar();
            return Ok(anuncios);
        }

        [HttpGet("{id}")]
        public IActionResult BuscarPorId(int id)
        {
            try
            {
                var anuncio = _service.BuscarPorId(id);
                return Ok(anuncio);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult Criar([FromBody] CriarAnuncioDto dto)
        {
            try
            {
                var anuncio = _service.Criar(dto);

                return CreatedAtAction(
                    nameof(BuscarPorId),
                    new { id = anuncio.Id },
                    anuncio
                    );
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, [FromBody] CriarAnuncioDto dto)
        {
            try
            {
                var anuncio = _service.Atualizar(id, dto);
                return Ok(anuncio);
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (BusinessException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            try
            {
                _service.Deletar(id);
                return NoContent();
            }
            catch (NotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}