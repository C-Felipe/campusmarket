namespace CampusMarket.API.DTOs
{
    public class CriarAnuncioDto
    {
        public string Titulo { get; set; } = string.Empty;

        public string Descricao {  get; set; } = string.Empty;

        public Decimal Preco {  get; set; }

        public string Telefone {  get; set; } = string.Empty;

        public string Categoria { get; set; } = string.Empty;
    }
}
