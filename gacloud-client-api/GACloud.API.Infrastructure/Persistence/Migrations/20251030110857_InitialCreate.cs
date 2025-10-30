using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GACloud.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Frotas");

            migrationBuilder.EnsureSchema(
                name: "Base");

            migrationBuilder.CreateTable(
                name: "CodigoPostal",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Localidade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CodigoPostal", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Epoca",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ano = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Predefinida = table.Column<bool>(type: "bit", nullable: false),
                    Bloqueada = table.Column<bool>(type: "bit", nullable: false),
                    EpocaAnteriorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Epoca", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Epoca_Epoca_EpocaAnteriorId",
                        column: x => x.EpocaAnteriorId,
                        principalSchema: "Base",
                        principalTable: "Epoca",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Marca",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Marca", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pais",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prefixo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pais", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Rubrica",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EpocaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClassificacaoTipo = table.Column<string>(type: "varchar(1)", nullable: true),
                    RubricaTipo = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rubrica", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rubrica_Epoca_EpocaId",
                        column: x => x.EpocaId,
                        principalSchema: "Base",
                        principalTable: "Epoca",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Modelo",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MarcaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modelo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Modelo_Marca_MarcaId",
                        column: x => x.MarcaId,
                        principalSchema: "Frotas",
                        principalTable: "Marca",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Distrito",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaisId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Distrito", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Distrito_Pais_PaisId",
                        column: x => x.PaisId,
                        principalSchema: "Base",
                        principalTable: "Pais",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Concelho",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DistritoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Concelho", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Concelho_Distrito_DistritoId",
                        column: x => x.DistritoId,
                        principalSchema: "Base",
                        principalTable: "Distrito",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Freguesia",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcelhoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Freguesia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Freguesia_Concelho_ConcelhoId",
                        column: x => x.ConcelhoId,
                        principalSchema: "Base",
                        principalTable: "Concelho",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Rua",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FreguesiaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rua", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rua_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Rua_Freguesia_FreguesiaId",
                        column: x => x.FreguesiaId,
                        principalSchema: "Base",
                        principalTable: "Freguesia",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Coveiro",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NIF = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RuaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Historico = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coveiro", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Coveiro_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Coveiro_Rua_RuaId",
                        column: x => x.RuaId,
                        principalSchema: "Base",
                        principalTable: "Rua",
                        principalColumn: "Id");
                });

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
                name: "AgenciaFuneraria",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Historico = table.Column<bool>(type: "bit", nullable: false),
                    EntidadeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AgenciaFuneraria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AgenciaFuneraria_Entidade_EntidadeId",
                        column: x => x.EntidadeId,
                        principalSchema: "Base",
                        principalTable: "Entidade",
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
                name: "IX_AgenciaFuneraria_EntidadeId",
                schema: "Frotas",
                table: "AgenciaFuneraria",
                column: "EntidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Concelho_DistritoId",
                schema: "Base",
                table: "Concelho",
                column: "DistritoId");

            migrationBuilder.CreateIndex(
                name: "IX_Coveiro_CodigoPostalId",
                schema: "Frotas",
                table: "Coveiro",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Coveiro_RuaId",
                schema: "Frotas",
                table: "Coveiro",
                column: "RuaId");

            migrationBuilder.CreateIndex(
                name: "IX_Distrito_PaisId",
                schema: "Base",
                table: "Distrito",
                column: "PaisId");

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

            migrationBuilder.CreateIndex(
                name: "IX_Epoca_EpocaAnteriorId",
                schema: "Base",
                table: "Epoca",
                column: "EpocaAnteriorId");

            migrationBuilder.CreateIndex(
                name: "IX_Freguesia_ConcelhoId",
                schema: "Base",
                table: "Freguesia",
                column: "ConcelhoId");

            migrationBuilder.CreateIndex(
                name: "IX_Modelo_MarcaId",
                schema: "Frotas",
                table: "Modelo",
                column: "MarcaId");

            migrationBuilder.CreateIndex(
                name: "IX_Rua_CodigoPostalId",
                schema: "Base",
                table: "Rua",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Rua_FreguesiaId",
                schema: "Base",
                table: "Rua",
                column: "FreguesiaId");

            migrationBuilder.CreateIndex(
                name: "IX_Rubrica_EpocaId",
                schema: "Base",
                table: "Rubrica",
                column: "EpocaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgenciaFuneraria",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Coveiro",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "EntidadeContacto",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Modelo",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Rubrica",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Entidade",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Marca",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Epoca",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Rua",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "CodigoPostal",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Freguesia",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Concelho",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Distrito",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Pais",
                schema: "Base");
        }
    }
}
