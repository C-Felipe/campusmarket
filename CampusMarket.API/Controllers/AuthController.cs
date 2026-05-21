using CampusMarket.API.DTOs;
using CampusMarket.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace CampusMarket.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            var token = _service.Register(dto);
            return Ok(new { token });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var token = _service.Login(dto);
            return Ok(new { token });
        }
    }
}