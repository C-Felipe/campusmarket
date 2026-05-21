using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusMarket.API.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaRelacionamentoUsuarioAnuncio : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Anuncios",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Anuncios_UsuarioId",
                table: "Anuncios",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Anuncios_Usuarios_UsuarioId",
                table: "Anuncios",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Anuncios_Usuarios_UsuarioId",
                table: "Anuncios");

            migrationBuilder.DropIndex(
                name: "IX_Anuncios_UsuarioId",
                table: "Anuncios");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Anuncios");
        }
    }
}
