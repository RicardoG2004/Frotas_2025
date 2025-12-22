using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUtilizacaoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Utilizacao",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataUtilizacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataUltimaConferencia = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FuncionarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HoraInicio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HoraFim = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Causa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Utilizacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Utilizacao_Funcionario_FuncionarioId",
                        column: x => x.FuncionarioId,
                        principalSchema: "Base",
                        principalTable: "Funcionario",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Utilizacao_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Utilizacao_FuncionarioId",
                schema: "Frotas",
                table: "Utilizacao",
                column: "FuncionarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Utilizacao_ViaturaId",
                schema: "Frotas",
                table: "Utilizacao",
                column: "ViaturaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Utilizacao",
                schema: "Frotas");
        }
    }
}
