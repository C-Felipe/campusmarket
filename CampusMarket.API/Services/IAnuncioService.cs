using CampusMarket.API.DTOs;

namespace CampusMarket.API.Services
{
    public interface IAnuncioService
    {
        List<AnuncioResponseDto> Listar(string? categoria = null, string? titulo = null);

        AnuncioResponseDto BuscarPorId(int id);

        AnuncioResponseDto Criar(CriarAnuncioDto dto, int usuarioId);

        void Deletar(int id, int usuarioId);

        AnuncioResponseDto Atualizar(int id, CriarAnuncioDto dto, int usuarioId);
    }
}
