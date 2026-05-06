using CampusMarket.API.DTOs;

namespace CampusMarket.API.Services
{
    public interface IAnuncioService
    {
            List<AnuncioResponseDto> Listar();

            AnuncioResponseDto BuscarPorId(int id);

            AnuncioResponseDto Criar(CriarAnuncioDto dto);

            void Deletar(int id);

        AnuncioResponseDto Atualizar(int id, CriarAnuncioDto dto);
        }
    }
