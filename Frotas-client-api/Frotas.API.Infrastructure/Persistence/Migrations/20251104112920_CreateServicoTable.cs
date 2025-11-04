using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateServicoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Servico",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Anos = table.Column<int>(type: "int", nullable: false),
                    Kms = table.Column<int>(type: "int", nullable: false),
                    Tipo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TaxaIvaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Custo = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CustoTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Servico", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Servico_TaxaIva_TaxaIvaId",
                        column: x => x.TaxaIvaId,
                        principalSchema: "Base",
                        principalTable: "TaxaIva",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Servico_TaxaIvaId",
                schema: "Frotas",
                table: "Servico",
                column: "TaxaIvaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Servico",
                schema: "Frotas");
        }
    }
}
