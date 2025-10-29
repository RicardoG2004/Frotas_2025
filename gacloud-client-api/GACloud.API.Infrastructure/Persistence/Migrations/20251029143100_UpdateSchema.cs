using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GACloud.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DefuntoTipo",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "ProprietarioSepultura",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Proprietario",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Sepultura",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "SepulturaTipo",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Talhao",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "SepulturaTipoDescricao",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Zona",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Cemiterio",
                schema: "Cemiterios");

            migrationBuilder.CreateTable(
                name: "Marca",
                schema: "Cemiterios",
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Marca",
                schema: "Cemiterios");

            migrationBuilder.CreateTable(
                name: "Cemiterio",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Morada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Predefinido = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cemiterio", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cemiterio_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DefuntoTipo",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefuntoTipo", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SepulturaTipoDescricao",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SepulturaTipoDescricao", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Proprietario",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CemiterioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EntidadeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Proprietario", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Proprietario_Cemiterio_CemiterioId",
                        column: x => x.CemiterioId,
                        principalSchema: "Cemiterios",
                        principalTable: "Cemiterio",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Proprietario_Entidade_EntidadeId",
                        column: x => x.EntidadeId,
                        principalSchema: "Base",
                        principalTable: "Entidade",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Zona",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CemiterioId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShapeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TemSvgShape = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zona", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Zona_Cemiterio_CemiterioId",
                        column: x => x.CemiterioId,
                        principalSchema: "Cemiterios",
                        principalTable: "Cemiterio",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SepulturaTipo",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EpocaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SepulturaTipoDescricaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AluguerDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AluguerRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AluguerValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AlvaraDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AlvaraRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AlvaraValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ConcessionadaDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcessionadaRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcessionadaValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExumacaoDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExumacaoRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExumacaoValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    InumacaoDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InumacaoRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InumacaoValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferenciaDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferenciaRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferenciaValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TransladacaoDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransladacaoRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransladacaoValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    VendaDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VendaRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VendaValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SepulturaTipo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SepulturaTipo_Epoca_EpocaId",
                        column: x => x.EpocaId,
                        principalSchema: "Base",
                        principalTable: "Epoca",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_SepulturaTipo_SepulturaTipoDescricao_SepulturaTipoDescricaoId",
                        column: x => x.SepulturaTipoDescricaoId,
                        principalSchema: "Cemiterios",
                        principalTable: "SepulturaTipoDescricao",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Talhao",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ZonaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShapeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TemSvgShape = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Talhao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Talhao_Zona_ZonaId",
                        column: x => x.ZonaId,
                        principalSchema: "Cemiterios",
                        principalTable: "Zona",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Sepultura",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SepulturaTipoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TalhaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Anulado = table.Column<bool>(type: "bit", nullable: false),
                    Area = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Bloqueada = table.Column<bool>(type: "bit", nullable: false),
                    Coluna = table.Column<string>(type: "varchar(10)", nullable: true),
                    Comprimento = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataAnulacao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataConcessao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataConhecimento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataFimAluguer = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataFimReserva = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataInicioAluguer = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataInicioReserva = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Fila = table.Column<string>(type: "varchar(10)", nullable: true),
                    Fundura1 = table.Column<bool>(type: "bit", nullable: false),
                    Fundura2 = table.Column<bool>(type: "bit", nullable: false),
                    Fundura3 = table.Column<bool>(type: "bit", nullable: false),
                    Largura = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Litigio = table.Column<bool>(type: "bit", nullable: true),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NumeroConhecimento = table.Column<string>(type: "varchar(10)", nullable: true),
                    Observacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Profundidade = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    SepulturaEstadoId = table.Column<int>(type: "int", nullable: false),
                    SepulturaSituacaoId = table.Column<int>(type: "int", nullable: false),
                    ShapeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TemSvgShape = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sepultura", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sepultura_SepulturaTipo_SepulturaTipoId",
                        column: x => x.SepulturaTipoId,
                        principalSchema: "Cemiterios",
                        principalTable: "SepulturaTipo",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Sepultura_Talhao_TalhaoId",
                        column: x => x.TalhaoId,
                        principalSchema: "Cemiterios",
                        principalTable: "Talhao",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProprietarioSepultura",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProprietarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SepulturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataInativacao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Fracao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Historico = table.Column<bool>(type: "bit", nullable: false),
                    IsProprietario = table.Column<bool>(type: "bit", nullable: false),
                    IsResponsavel = table.Column<bool>(type: "bit", nullable: false),
                    IsResponsavelGuiaReceita = table.Column<bool>(type: "bit", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProprietarioSepultura", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProprietarioSepultura_Proprietario_ProprietarioId",
                        column: x => x.ProprietarioId,
                        principalSchema: "Cemiterios",
                        principalTable: "Proprietario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ProprietarioSepultura_Sepultura_SepulturaId",
                        column: x => x.SepulturaId,
                        principalSchema: "Cemiterios",
                        principalTable: "Sepultura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cemiterio_CodigoPostalId",
                schema: "Cemiterios",
                table: "Cemiterio",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Proprietario_CemiterioId",
                schema: "Cemiterios",
                table: "Proprietario",
                column: "CemiterioId");

            migrationBuilder.CreateIndex(
                name: "IX_Proprietario_EntidadeId",
                schema: "Cemiterios",
                table: "Proprietario",
                column: "EntidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProprietarioSepultura_ProprietarioId",
                schema: "Cemiterios",
                table: "ProprietarioSepultura",
                column: "ProprietarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ProprietarioSepultura_SepulturaId",
                schema: "Cemiterios",
                table: "ProprietarioSepultura",
                column: "SepulturaId");

            migrationBuilder.CreateIndex(
                name: "IX_Sepultura_SepulturaTipoId",
                schema: "Cemiterios",
                table: "Sepultura",
                column: "SepulturaTipoId");

            migrationBuilder.CreateIndex(
                name: "IX_Sepultura_TalhaoId",
                schema: "Cemiterios",
                table: "Sepultura",
                column: "TalhaoId");

            migrationBuilder.CreateIndex(
                name: "IX_SepulturaTipo_EpocaId",
                schema: "Cemiterios",
                table: "SepulturaTipo",
                column: "EpocaId");

            migrationBuilder.CreateIndex(
                name: "IX_SepulturaTipo_SepulturaTipoDescricaoId",
                schema: "Cemiterios",
                table: "SepulturaTipo",
                column: "SepulturaTipoDescricaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Talhao_ZonaId",
                schema: "Cemiterios",
                table: "Talhao",
                column: "ZonaId");

            migrationBuilder.CreateIndex(
                name: "IX_Zona_CemiterioId",
                schema: "Cemiterios",
                table: "Zona",
                column: "CemiterioId");
        }
    }
}
