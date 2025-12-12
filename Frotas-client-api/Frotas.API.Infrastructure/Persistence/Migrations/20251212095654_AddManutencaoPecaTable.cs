using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddManutencaoPecaTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Manutencao",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataRequisicao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FuncionarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataEntrada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HoraEntrada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataSaida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HoraSaida = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    KmsRegistados = table.Column<int>(type: "int", nullable: false),
                    TotalSemIva = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ValorIva = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Manutencao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Manutencao_Fse_FseId",
                        column: x => x.FseId,
                        principalSchema: "Base",
                        principalTable: "Fse",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Manutencao_Funcionario_FuncionarioId",
                        column: x => x.FuncionarioId,
                        principalSchema: "Base",
                        principalTable: "Funcionario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Manutencao_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ManutencaoPeca",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ManutencaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PecaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantidade = table.Column<int>(type: "int", nullable: false),
                    Garantia = table.Column<int>(type: "int", nullable: true),
                    Validade = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValorSemIva = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IvaPercentagem = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ValorTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManutencaoPeca", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManutencaoPeca_Manutencao_ManutencaoId",
                        column: x => x.ManutencaoId,
                        principalSchema: "Frotas",
                        principalTable: "Manutencao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManutencaoPeca_Peca_PecaId",
                        column: x => x.PecaId,
                        principalSchema: "Frotas",
                        principalTable: "Peca",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ManutencaoServico",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ManutencaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ServicoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Quantidade = table.Column<int>(type: "int", nullable: false),
                    KmProxima = table.Column<int>(type: "int", nullable: true),
                    DataProxima = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ValorSemIva = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IvaPercentagem = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ValorTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManutencaoServico", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManutencaoServico_Manutencao_ManutencaoId",
                        column: x => x.ManutencaoId,
                        principalSchema: "Frotas",
                        principalTable: "Manutencao",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ManutencaoServico_Servico_ServicoId",
                        column: x => x.ServicoId,
                        principalSchema: "Frotas",
                        principalTable: "Servico",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Manutencao_FseId",
                schema: "Frotas",
                table: "Manutencao",
                column: "FseId");

            migrationBuilder.CreateIndex(
                name: "IX_Manutencao_FuncionarioId",
                schema: "Frotas",
                table: "Manutencao",
                column: "FuncionarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Manutencao_ViaturaId",
                schema: "Frotas",
                table: "Manutencao",
                column: "ViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_ManutencaoPeca_ManutencaoId",
                schema: "Frotas",
                table: "ManutencaoPeca",
                column: "ManutencaoId");

            migrationBuilder.CreateIndex(
                name: "IX_ManutencaoPeca_PecaId",
                schema: "Frotas",
                table: "ManutencaoPeca",
                column: "PecaId");

            migrationBuilder.CreateIndex(
                name: "IX_ManutencaoServico_ManutencaoId",
                schema: "Frotas",
                table: "ManutencaoServico",
                column: "ManutencaoId");

            migrationBuilder.CreateIndex(
                name: "IX_ManutencaoServico_ServicoId",
                schema: "Frotas",
                table: "ManutencaoServico",
                column: "ServicoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ManutencaoPeca",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ManutencaoServico",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Manutencao",
                schema: "Frotas");
        }
    }
}
