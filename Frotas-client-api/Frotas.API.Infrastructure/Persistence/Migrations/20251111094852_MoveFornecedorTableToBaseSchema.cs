using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MoveFornecedorTableToBaseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Fornecedor",
                schema: "Frotas",
                newName: "Fornecedor",
                newSchema: "Base");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "Fornecedor",
                schema: "Base",
                newName: "Fornecedor",
                newSchema: "Frotas");
        }
    }
}
