using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCombustivelIdToAbastecimento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CombustivelId",
                schema: "Frotas",
                table: "Abastecimento",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Abastecimento_CombustivelId",
                schema: "Frotas",
                table: "Abastecimento",
                column: "CombustivelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Abastecimento_Combustivel_CombustivelId",
                schema: "Frotas",
                table: "Abastecimento",
                column: "CombustivelId",
                principalSchema: "Frotas",
                principalTable: "Combustivel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Abastecimento_Combustivel_CombustivelId",
                schema: "Frotas",
                table: "Abastecimento");

            migrationBuilder.DropIndex(
                name: "IX_Abastecimento_CombustivelId",
                schema: "Frotas",
                table: "Abastecimento");

            migrationBuilder.DropColumn(
                name: "CombustivelId",
                schema: "Frotas",
                table: "Abastecimento");
        }
    }
}
