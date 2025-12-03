using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddDocumentosToViaturaCondutor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CondutoresDocumentos",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.AddColumn<string>(
                name: "Documentos",
                schema: "Frotas",
                table: "ViaturaCondutor",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Documentos",
                schema: "Frotas",
                table: "ViaturaCondutor");

            migrationBuilder.AddColumn<string>(
                name: "CondutoresDocumentos",
                schema: "Frotas",
                table: "Viatura",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
