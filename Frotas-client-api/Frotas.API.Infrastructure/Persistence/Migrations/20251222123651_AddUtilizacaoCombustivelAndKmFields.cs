using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUtilizacaoCombustivelAndKmFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "ValorCombustivel",
                schema: "Frotas",
                table: "Utilizacao",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "KmPartida",
                schema: "Frotas",
                table: "Utilizacao",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "KmChegada",
                schema: "Frotas",
                table: "Utilizacao",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalKmEfectuados",
                schema: "Frotas",
                table: "Utilizacao",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalKmConferidos",
                schema: "Frotas",
                table: "Utilizacao",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalKmAConferir",
                schema: "Frotas",
                table: "Utilizacao",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValorCombustivel",
                schema: "Frotas",
                table: "Utilizacao");

            migrationBuilder.DropColumn(
                name: "KmPartida",
                schema: "Frotas",
                table: "Utilizacao");

            migrationBuilder.DropColumn(
                name: "KmChegada",
                schema: "Frotas",
                table: "Utilizacao");

            migrationBuilder.DropColumn(
                name: "TotalKmEfectuados",
                schema: "Frotas",
                table: "Utilizacao");

            migrationBuilder.DropColumn(
                name: "TotalKmConferidos",
                schema: "Frotas",
                table: "Utilizacao");

            migrationBuilder.DropColumn(
                name: "TotalKmAConferir",
                schema: "Frotas",
                table: "Utilizacao");
        }
    }
}
