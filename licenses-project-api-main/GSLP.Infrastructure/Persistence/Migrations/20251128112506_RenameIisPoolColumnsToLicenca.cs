using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameIisPoolColumnsToLicenca : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ClientAppPoolName",
                schema: "Plataforma",
                table: "Licencas",
                newName: "FrontendPoolName");

            migrationBuilder.RenameColumn(
                name: "ApiAppPoolName",
                schema: "Plataforma",
                table: "Licencas",
                newName: "ApiPoolName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FrontendPoolName",
                schema: "Plataforma",
                table: "Licencas",
                newName: "ClientAppPoolName");

            migrationBuilder.RenameColumn(
                name: "ApiPoolName",
                schema: "Plataforma",
                table: "Licencas",
                newName: "ApiAppPoolName");
        }
    }
}
