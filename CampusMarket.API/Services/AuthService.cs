using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CampusMarket.API.Data;
using CampusMarket.API.DTOs;
using CampusMarket.API.Exceptions;
using CampusMarket.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace CampusMarket.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public string Register(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Nome))
                throw new BusinessException("O nome é obrigatório!");

            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new BusinessException("O email é obrigatório!");

            if (string.IsNullOrWhiteSpace(dto.Senha))
                throw new BusinessException("A senha é obrigatória!");

            if (dto.Senha.Length < 6)
                throw new BusinessException("A senha deve ter no mínimo 6 caracteres!");

            if (string.IsNullOrWhiteSpace(dto.Telefone))
                throw new BusinessException("O telefone é obrigatório!");

            if (!dto.Telefone.All(char.IsDigit))
                throw new BusinessException("O telefone deve conter apenas números!");

            if (dto.Telefone.Length != 11)
                throw new BusinessException("O telefone deve conter 11 dígitos!");

            var emailExiste = _context.Usuarios.Any(u => u.Email == dto.Email);
            if (emailExiste)
                throw new BusinessException("Esse email já está cadastrado!");

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Email = dto.Email,
                Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                Telefone = dto.Telefone
            };

            _context.Usuarios.Add(usuario);
            _context.SaveChanges();

            return GerarToken(usuario);
        }

        public string Login(LoginDto dto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Email == dto.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
                throw new BusinessException("Email ou senha inválidos!");

            return GerarToken(usuario);
        }

        private string GerarToken(Usuario usuario)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("id", usuario.Id.ToString()),
                new Claim("email", usuario.Email)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}