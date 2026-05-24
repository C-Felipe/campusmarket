using CampusMarket.API.DTOs;
using CampusMarket.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CampusMarket.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuariosController(IUsuarioService service)
        {
            _service = service;
        }

        [HttpGet("me")]
        public IActionResult Me()
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            var usuario = _service.BuscarPorId(usuarioId);
            return Ok(usuario);
        }

        [HttpGet("meus-anuncios")]
        public IActionResult MeusAnuncios()
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            var anuncios = _service.BuscarMeusAnuncios(usuarioId);
            return Ok(anuncios);
        }

        [HttpPut("perfil")]
        public IActionResult EditarPerfil([FromBody] EditarPerfilDto dto)
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            var usuario = _service.EditarPerfil(usuarioId, dto);
            return Ok(usuario);
        }

        [HttpPut("senha")]
        public IActionResult TrocarSenha([FromBody]  TrocarSenhaDto dto)
        {
            var usuarioId = int.Parse(User.FindFirst("id")!.Value);
            _service.TrocarSenha(usuarioId, dto);
            return NoContent();
        }
    }
}
