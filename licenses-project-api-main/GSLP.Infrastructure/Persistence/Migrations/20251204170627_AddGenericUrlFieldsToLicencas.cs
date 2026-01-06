using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGenericUrlFieldsToLicencas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Url1",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url2",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url3",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url4",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url5",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url6",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url7",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url8",
                schema: "Plataforma",
                table: "Licencas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url1",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url2",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url3",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url4",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url5",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url6",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url7",
                schema: "Plataforma",
                table: "Licencas");

            migrationBuilder.DropColumn(
                name: "Url8",
                schema: "Plataforma",
                table: "Licencas");
        }
    }
}
