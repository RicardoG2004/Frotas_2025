using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEntidadeTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EntidadeContacto",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Entidade",
                schema: "Base");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Entidade",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NIF = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NIFEstrangeiro = table.Column<bool>(type: "bit", nullable: false),
                    RuaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RuaNumeroPorta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RuaAndar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CartaoIdentificacaoTipoId = table.Column<int>(type: "int", nullable: false),
                    CartaoIdentificacaoNumero = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CartaoIdentificacaoDataEmissao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CartaoIdentificacaoDataValidade = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EstadoCivilId = table.Column<int>(type: "int", nullable: false),
                    Sexo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    Historico = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entidade", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Entidade_Rua_RuaId",
                        column: x => x.RuaId,
                        principalSchema: "Base",
                        principalTable: "Rua",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "EntidadeContacto",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EntidadeContactoTipoId = table.Column<int>(type: "int", nullable: false),
                    EntidadeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Valor = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Principal = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EntidadeContacto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EntidadeContacto_Entidade_EntidadeId",
                        column: x => x.EntidadeId,
                        principalSchema: "Base",
                        principalTable: "Entidade",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Entidade_RuaId",
                schema: "Base",
                table: "Entidade",
                column: "RuaId");

            migrationBuilder.CreateIndex(
                name: "IX_EntidadeContacto_EntidadeId",
                schema: "Base",
                table: "EntidadeContacto",
                column: "EntidadeId");
        }
    }
}
