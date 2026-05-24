namespace CampusMarket.API.DTOs
{
    public class CriarAnuncioDto
    {
        public string Titulo { get; set; } = string.Empty;

        public string Descricao {  get; set; } = string.Empty;

        public decimal Preco {  get; set; }

        public string Categoria { get; set; } = string.Empty;
    }
}
