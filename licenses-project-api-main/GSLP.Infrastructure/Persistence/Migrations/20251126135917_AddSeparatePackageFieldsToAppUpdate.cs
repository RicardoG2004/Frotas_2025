using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSeparatePackageFieldsToAppUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FicheiroUpdateApi",
                schema: "Aplicacao",
                table: "AppUpdates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FicheiroUpdateFrontend",
                schema: "Aplicacao",
                table: "AppUpdates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HashFicheiroApi",
                schema: "Aplicacao",
                table: "AppUpdates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HashFicheiroFrontend",
                schema: "Aplicacao",
                table: "AppUpdates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TamanhoFicheiroApi",
                schema: "Aplicacao",
                table: "AppUpdates",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "TamanhoFicheiroFrontend",
                schema: "Aplicacao",
                table: "AppUpdates",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FicheiroUpdateApi",
                schema: "Aplicacao",
                table: "AppUpdates");

            migrationBuilder.DropColumn(
                name: "FicheiroUpdateFrontend",
                schema: "Aplicacao",
                table: "AppUpdates");

            migrationBuilder.DropColumn(
                name: "HashFicheiroApi",
                schema: "Aplicacao",
                table: "AppUpdates");

            migrationBuilder.DropColumn(
                name: "HashFicheiroFrontend",
                schema: "Aplicacao",
                table: "AppUpdates");

            migrationBuilder.DropColumn(
                name: "TamanhoFicheiroApi",
                schema: "Aplicacao",
                table: "AppUpdates");

            migrationBuilder.DropColumn(
                name: "TamanhoFicheiroFrontend",
                schema: "Aplicacao",
                table: "AppUpdates");
        }
    }
}
