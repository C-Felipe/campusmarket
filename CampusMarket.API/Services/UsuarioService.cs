using CampusMarket.API.Data;
using CampusMarket.API.DTOs;
using CampusMarket.API.Exceptions;


namespace CampusMarket.API.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly AppDbContext _context;

        public UsuarioService(AppDbContext context)
        {
            _context = context;
        }

        public UsuarioResponseDto BuscarPorId(int id)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == id);

            if (usuario == null)
                throw new NotFoundException("Usuário não encontrado.");

            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone,
            };
        }

        public List<AnuncioResponseDto> BuscarMeusAnuncios(int usuarioId)
        {
            return _context.Anuncios
                .Where(a => a.UsuarioId == usuarioId)
                .Select(a => new AnuncioResponseDto
                {
                    Id = a.Id,
                    Titulo = a.Titulo,
                    Descricao = a.Descricao,
                    Preco = a.Preco,
                    Categoria = a.Categoria,
                    DataCriacao = a.DataCriacao,
                    UsuarioId = usuarioId,
                    NomeVendedor = a.Usuario!.Nome,
                    TelefoneVendedor = a.Usuario!.Telefone
                }).ToList();
        }

        public UsuarioResponseDto EditarPerfil(int id, EditarPerfilDto dto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == id);

            if (usuario == null)
                throw new NotFoundException("Usuário não encontrado.");

            if (string.IsNullOrWhiteSpace(dto.Nome))
                throw new BusinessException("O nome é obrigatório!");

            if (string.IsNullOrWhiteSpace(dto.Telefone))
                throw new BusinessException("O telefone é obrigatório!");

            if (!dto.Telefone.All(char.IsDigit))
                throw new BusinessException("O telefone deve conter apenas números!");

            if (dto.Telefone.Length != 11)
                throw new BusinessException("O telefone deve conter 11 dígitos!");

            usuario.Nome = dto.Nome;
            usuario.Telefone = dto.Telefone;

            _context.SaveChanges();

            return new UsuarioResponseDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Email = usuario.Email,
                Telefone = usuario.Telefone,
            };
        }

        public void TrocarSenha(int id, TrocarSenhaDto dto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == id);

            if (usuario == null)
                throw new NotFoundException("Usuário não encontrado.");

            if (string.IsNullOrWhiteSpace(dto.SenhaAtual))
                throw new BusinessException("Informe a senha atual!");

            if (string.IsNullOrWhiteSpace(dto.NovaSenha))
                throw new BusinessException("Informe a nova senha!");

            if (dto.NovaSenha.Length < 6)
                throw new BusinessException("A novaa senha deve ter no mínimo 6 caracteres!");

            if (!BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, usuario.Senha))
                throw new BusinessException("Senha atual incorreta!");

            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);

            _context.SaveChanges();
        }
    }
}
