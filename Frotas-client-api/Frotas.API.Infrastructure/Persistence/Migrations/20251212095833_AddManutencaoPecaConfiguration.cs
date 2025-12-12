using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddManutencaoPecaConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ManutencaoPeca_Manutencao_ManutencaoId",
                schema: "Frotas",
                table: "ManutencaoPeca");

            migrationBuilder.DropForeignKey(
                name: "FK_ManutencaoPeca_Peca_PecaId",
                schema: "Frotas",
                table: "ManutencaoPeca");

            migrationBuilder.AddForeignKey(
                name: "FK_ManutencaoPeca_Manutencao_ManutencaoId",
                schema: "Frotas",
                table: "ManutencaoPeca",
                column: "ManutencaoId",
                principalSchema: "Frotas",
                principalTable: "Manutencao",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ManutencaoPeca_Peca_PecaId",
                schema: "Frotas",
                table: "ManutencaoPeca",
                column: "PecaId",
                principalSchema: "Frotas",
                principalTable: "Peca",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ManutencaoPeca_Manutencao_ManutencaoId",
                schema: "Frotas",
                table: "ManutencaoPeca");

            migrationBuilder.DropForeignKey(
                name: "FK_ManutencaoPeca_Peca_PecaId",
                schema: "Frotas",
                table: "ManutencaoPeca");

            migrationBuilder.AddForeignKey(
                name: "FK_ManutencaoPeca_Manutencao_ManutencaoId",
                schema: "Frotas",
                table: "ManutencaoPeca",
                column: "ManutencaoId",
                principalSchema: "Frotas",
                principalTable: "Manutencao",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ManutencaoPeca_Peca_PecaId",
                schema: "Frotas",
                table: "ManutencaoPeca",
                column: "PecaId",
                principalSchema: "Frotas",
                principalTable: "Peca",
                principalColumn: "Id");
        }
    }
}
