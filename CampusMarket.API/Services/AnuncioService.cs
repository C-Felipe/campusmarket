using CampusMarket.API.DTOs;
using CampusMarket.API.Models;
using CampusMarket.API.Exceptions;

namespace CampusMarket.API.Services
{
    public class AnuncioService : IAnuncioService
    {
        private static List<Anuncio> anuncios = new List<Anuncio>();

        public List<AnuncioResponseDto> Listar()
        {
            return anuncios.Select(a => new AnuncioResponseDto
            {
                Id = a.Id,
                Titulo = a.Titulo,
                Descricao = a.Descricao,
                Preco = a.Preco,
                Telefone = a.Telefone,
                Categoria = a.Categoria,
                DataCriacao = a.DataCriacao,
            }).ToList();
        }

        //Busca anúncio por ID
        public AnuncioResponseDto BuscarPorId(int id)
        {
            var anuncio = anuncios.FirstOrDefault (a => a.Id == id);

            if (anuncio == null)
                throw new NotFoundException("Anúncio não encontrado.");

            return new AnuncioResponseDto
            {
                Id = anuncio.Id,
                Titulo = anuncio.Titulo,
                Descricao = anuncio.Descricao,
                Preco = anuncio.Preco,
                Telefone = anuncio.Telefone,
                Categoria = anuncio.Categoria,
                DataCriacao = anuncio.DataCriacao,
            };
        }

        //Cria um anúncio novo
        public AnuncioResponseDto Criar(CriarAnuncioDto dto)
        {
            ValidarDto(dto);

            var anuncio = new Anuncio
            {
                Id = anuncios.Any() ? anuncios.Max(a => a.Id) + 1 : 1,
                Titulo = dto.Titulo,
                Descricao = dto.Descricao,
                Preco = dto.Preco,
                Telefone = dto.Telefone,
                Categoria = dto.Categoria,
                DataCriacao = DateTime.UtcNow
            };

            anuncios.Add(anuncio);

            return new AnuncioResponseDto
            {
                Id = anuncio.Id,
                Titulo = anuncio.Titulo,
                Descricao = anuncio.Descricao,
                Preco = anuncio.Preco,
                Telefone = anuncio.Telefone,
                Categoria = anuncio.Categoria,
                DataCriacao = anuncio.DataCriacao
            };
        }

        public void Deletar(int id)
        {
            var anuncio = anuncios.FirstOrDefault(a => a.Id == id);

            if (anuncio == null)
                throw new Exception("Anúncio não encontrado.");

            anuncios.Remove(anuncio);
        }

        //Atualiza os dados do anúncio, menos a data de criação 
        public AnuncioResponseDto Atualizar(int id, CriarAnuncioDto dto)
        {
            ValidarDto(dto);

            var anuncio = anuncios.FirstOrDefault(a => a.Id == id);

            if (anuncio == null)
                throw new Exception("Anúncio não encontrado.");

            anuncio.Titulo = dto.Titulo;
            anuncio.Descricao = dto.Descricao;
            anuncio.Preco = dto.Preco;
            anuncio.Telefone = dto.Telefone;
            anuncio.Categoria = dto.Categoria;

            return new AnuncioResponseDto
            {
                Id = anuncio.Id,
                Titulo = anuncio.Titulo,
                Descricao = anuncio.Descricao,
                Preco = anuncio.Preco,
                Telefone = anuncio.Telefone,
                Categoria = anuncio.Categoria,
                DataCriacao = anuncio.DataCriacao
            };
        }

        public void ValidarDto(CriarAnuncioDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Titulo))
                throw new BusinessException("O Título é obrigatório!");

            if (dto.Preco <= 0)
                throw new BusinessException("O preço deve ser maior que zero!");

            if (string.IsNullOrWhiteSpace(dto.Telefone))
                throw new BusinessException("O pelefone é obrigatório!");

            if (!dto.Telefone.All(char.IsDigit))
                throw new BusinessException("O telefone deve conter apenas números!");

            if (dto.Telefone.Length != 11)
                throw new BusinessException("O telefone deve conter 11 dígitos!");
        }
    } 
}
