using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddVersaoInstaladaToLicenca : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VersaoInstalada",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VersaoInstalada",
                schema: "Plataforma",
                table: "Licencas");
        }
    }
}
