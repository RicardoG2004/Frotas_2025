using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefactorViaturaDocumentosEImagem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remover colunas antigas
            migrationBuilder.DropColumn(
                name: "URLImagem1",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.DropColumn(
                name: "URLImagem2",
                schema: "Frotas",
                table: "Viatura");

            // Adicionar novas colunas
            migrationBuilder.AddColumn<string>(
                name: "Imagem",
                schema: "Frotas",
                table: "Viatura",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Documentos",
                schema: "Frotas",
                table: "Viatura",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverter - remover novas colunas
            migrationBuilder.DropColumn(
                name: "Imagem",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.DropColumn(
                name: "Documentos",
                schema: "Frotas",
                table: "Viatura");

            // Reverter - recriar colunas antigas
            migrationBuilder.AddColumn<string>(
                name: "URLImagem1",
                schema: "Frotas",
                table: "Viatura",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "URLImagem2",
                schema: "Frotas",
                table: "Viatura",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
