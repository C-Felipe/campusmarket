using CampusMarket.API.DTOs;

namespace CampusMarket.API.Services
{
    public interface IUsuarioService
    {
        UsuarioResponseDto BuscarPorId(int id);
        List<AnuncioResponseDto> BuscarMeusAnuncios(int usuarioId);
    }
}
