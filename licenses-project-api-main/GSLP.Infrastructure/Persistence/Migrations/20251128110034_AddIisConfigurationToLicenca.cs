using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIisConfigurationToLicenca : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApiAppPoolName",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApiPath",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClientAppPoolName",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FrontendPath",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApiAppPoolName",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "ApiPath",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "ClientAppPoolName",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "FrontendPath",
                schema: "Plataforma",
                table: "Licencas");
        }
    }
}
