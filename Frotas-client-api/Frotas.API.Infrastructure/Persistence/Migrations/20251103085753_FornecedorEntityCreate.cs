using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FornecedorEntityCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Fornecedor",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumContribuinte = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MoradaEscritorio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodigoPostalEscritorioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaisEscritorioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MoradaCarga = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodigoPostalCargaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaisCargaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MesmoEndereco = table.Column<bool>(type: "bit", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    Origem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contacto = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telefone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Telemovel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Fornecedor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Fornecedor_CodigoPostal_CodigoPostalCargaId",
                        column: x => x.CodigoPostalCargaId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Fornecedor_CodigoPostal_CodigoPostalEscritorioId",
                        column: x => x.CodigoPostalEscritorioId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Fornecedor_Pais_PaisCargaId",
                        column: x => x.PaisCargaId,
                        principalSchema: "Base",
                        principalTable: "Pais",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Fornecedor_Pais_PaisEscritorioId",
                        column: x => x.PaisEscritorioId,
                        principalSchema: "Base",
                        principalTable: "Pais",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedor_CodigoPostalCargaId",
                schema: "Frotas",
                table: "Fornecedor",
                column: "CodigoPostalCargaId");

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedor_CodigoPostalEscritorioId",
                schema: "Frotas",
                table: "Fornecedor",
                column: "CodigoPostalEscritorioId");

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedor_PaisCargaId",
                schema: "Frotas",
                table: "Fornecedor",
                column: "PaisCargaId");

            migrationBuilder.CreateIndex(
                name: "IX_Fornecedor_PaisEscritorioId",
                schema: "Frotas",
                table: "Fornecedor",
                column: "PaisEscritorioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Fornecedor",
                schema: "Frotas");
        }
    }
}
