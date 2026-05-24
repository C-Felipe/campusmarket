using CampusMarket.API.DTOs;
using CampusMarket.API.Models;
using CampusMarket.API.Exceptions;
using CampusMarket.API.Data;
using Microsoft.EntityFrameworkCore;

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
                Categoria = a.Categoria,
                DataCriacao = a.DataCriacao,
                UsuarioId = a.UsuarioId,
                NomeVendedor = a.Usuario!.Nome,
                TelefoneVendedor = a.Usuario!.Telefone
            }).ToList();
        }

        //Busca anúncio por ID
        public AnuncioResponseDto BuscarPorId(int id)
        {
            var anuncio = _context.Anuncios
                .Include(a => a.Usuario)
                .FirstOrDefault (a => a.Id == id);

            if (anuncio == null)
                throw new NotFoundException("Anúncio não encontrado.");

            return new AnuncioResponseDto
            {
                Id = anuncio.Id,
                Titulo = anuncio.Titulo,
                Descricao = anuncio.Descricao,
                Preco = anuncio.Preco,
                Categoria = anuncio.Categoria,
                DataCriacao = anuncio.DataCriacao,
                UsuarioId = anuncio.UsuarioId,
                NomeVendedor = anuncio.Usuario!.Nome,
                TelefoneVendedor = anuncio.Usuario!.Telefone
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
                Categoria = dto.Categoria,
                DataCriacao = DateTime.UtcNow,
                UsuarioId = usuarioId
            };

            _context.Anuncios.Add(anuncio);
            _context.SaveChanges();

            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == usuarioId)!;

            return new AnuncioResponseDto
            {
                Id = anuncio.Id,
                Titulo = anuncio.Titulo,
                Descricao = anuncio.Descricao,
                Preco = anuncio.Preco,
                Categoria = anuncio.Categoria,
                DataCriacao = anuncio.DataCriacao,
                UsuarioId = anuncio.UsuarioId,
                NomeVendedor = usuario.Nome,
                TelefoneVendedor = usuario.Telefone
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
            anuncio.Categoria = dto.Categoria;

            _context.SaveChanges();

            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == usuarioId)!;

            return new AnuncioResponseDto
            {
                Id = anuncio.Id,
                Titulo = anuncio.Titulo,
                Descricao = anuncio.Descricao,
                Preco = anuncio.Preco,
                Categoria = anuncio.Categoria,
                DataCriacao = anuncio.DataCriacao,
                UsuarioId = anuncio.UsuarioId,
                NomeVendedor = usuario.Nome,
                TelefoneVendedor = usuario.Telefone
            };
        }

        private void ValidarDto(CriarAnuncioDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Titulo))
                throw new BusinessException("O Título é obrigatório!");

            if (dto.Preco <= 0)
                throw new BusinessException("O preço deve ser maior que zero!");
        }
    } 
}
