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
    }
}
