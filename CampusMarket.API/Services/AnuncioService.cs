using CampusMarket.API.DTOs;
using CampusMarket.API.Models;
using CampusMarket.API.Exceptions;
using CampusMarket.API.Data;

namespace CampusMarket.API.Services
{
    public class AnuncioService : IAnuncioService
    {
        private readonly AppDbContext _context;

        public AnuncioService(AppDbContext context)
        {
            _context = context;
        }

        public List<AnuncioResponseDto> Listar()
        {
            return _context.Anuncios.Select(a => new AnuncioResponseDto
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
            var anuncio = _context.Anuncios.FirstOrDefault (a => a.Id == id);

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
        public AnuncioResponseDto Criar(CriarAnuncioDto dto, int usuarioId)
        {
            ValidarDto(dto);

            var anuncio = new Anuncio
            {

                Titulo = dto.Titulo,
                Descricao = dto.Descricao,
                Preco = dto.Preco,
                Telefone = dto.Telefone,
                Categoria = dto.Categoria,
                DataCriacao = DateTime.UtcNow,
                UsuarioId = usuarioId
            };

            _context.Anuncios.Add(anuncio);
            _context.SaveChanges();

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

        public void Deletar(int id, int usuarioId)
        {
            var anuncio = _context.Anuncios.FirstOrDefault(a => a.Id == id);

            if (anuncio == null)
                throw new NotFoundException("Anúncio não encontrado.");

            //para verificar se o usuario é dono do anuncio
            if (anuncio.UsuarioId != usuarioId)
                throw new BusinessException("Você não tem permissão para deletar esse anúncio.");

            _context.Anuncios.Remove(anuncio);
            _context.SaveChanges();
        }

        //Atualiza os dados do anúncio, menos a data de criação 
        public AnuncioResponseDto Atualizar(int id, CriarAnuncioDto dto, int usuarioId)
        {
            ValidarDto(dto);

            var anuncio = _context.Anuncios.FirstOrDefault(a => a.Id == id);

            if (anuncio == null)
                throw new NotFoundException("Anúncio não encontrado.");

            if (anuncio.UsuarioId != usuarioId)
                throw new BusinessException("Você não tem permissão para editar esse anúncio.");

            anuncio.Titulo = dto.Titulo;
            anuncio.Descricao = dto.Descricao;
            anuncio.Preco = dto.Preco;
            anuncio.Telefone = dto.Telefone;
            anuncio.Categoria = dto.Categoria;

            _context.SaveChanges();

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

        private void ValidarDto(CriarAnuncioDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Titulo))
                throw new BusinessException("O Título é obrigatório!");

            if (dto.Preco <= 0)
                throw new BusinessException("O preço deve ser maior que zero!");

            if (string.IsNullOrWhiteSpace(dto.Telefone))
                throw new BusinessException("O telefone é obrigatório!");

            if (!dto.Telefone.All(char.IsDigit))
                throw new BusinessException("O telefone deve conter apenas números!");

            if (dto.Telefone.Length != 11)
                throw new BusinessException("O telefone deve conter 11 dígitos!");
        }
    } 
}
