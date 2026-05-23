using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusMarket.API.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaTelefoneUsuarioRemoveTelefoneAnuncio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Anuncios");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Usuarios");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Anuncios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
