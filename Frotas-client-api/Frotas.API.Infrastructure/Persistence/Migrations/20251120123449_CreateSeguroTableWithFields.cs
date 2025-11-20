using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateSeguroTableWithFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Seguro",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Apolice = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SeguradoraId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssistenciaViagem = table.Column<bool>(type: "bit", nullable: false),
                    CartaVerde = table.Column<bool>(type: "bit", nullable: false),
                    ValorCobertura = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CustoAnual = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RiscosCobertos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataInicial = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataFinal = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Periodicidade = table.Column<int>(type: "int", nullable: false, defaultValue: 2),
                    MetodoPagamento = table.Column<int>(type: "int", nullable: true),
                    DataPagamento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Seguro", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Seguro_Seguradora_SeguradoraId",
                        column: x => x.SeguradoraId,
                        principalSchema: "Frotas",
                        principalTable: "Seguradora",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Seguro_SeguradoraId",
                schema: "Frotas",
                table: "Seguro",
                column: "SeguradoraId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Seguro",
                schema: "Frotas");
        }
    }
}
