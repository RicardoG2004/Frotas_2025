using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAppUpdateEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUpdates",
                schema: "Aplicacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Versao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FicheiroUpdate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TamanhoFicheiro = table.Column<long>(type: "bigint", nullable: false),
                    HashFicheiro = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataLancamento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    Obrigatorio = table.Column<bool>(type: "bit", nullable: false),
                    VersaoMinima = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AplicacaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NotasAtualizacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUpdates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppUpdates_Aplicacoes_AplicacaoId",
                        column: x => x.AplicacaoId,
                        principalSchema: "Aplicacao",
                        principalTable: "Aplicacoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUpdates_AplicacaoId",
                schema: "Aplicacao",
                table: "AppUpdates",
                column: "AplicacaoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUpdates",
                schema: "Aplicacao");
        }
    }
}
