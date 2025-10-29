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
                name: "Cemiterios");

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
                name: "DefuntoTipo",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefuntoTipo", x => x.Id);
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
                name: "SepulturaTipoDescricao",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SepulturaTipoDescricao", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cemiterio",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Morada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Predefinido = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "SepulturaTipo",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EpocaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VendaRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VendaValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    VendaDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AluguerRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AluguerValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AluguerDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AlvaraRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AlvaraValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AlvaraDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransladacaoRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransladacaoValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TransladacaoDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferenciaRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransferenciaValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TransferenciaDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExumacaoRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExumacaoValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ExumacaoDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InumacaoRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InumacaoValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    InumacaoDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcessionadaRubrica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcessionadaValor = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ConcessionadaDescricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SepulturaTipoDescricaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "Zona",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CemiterioId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TemSvgShape = table.Column<bool>(type: "bit", nullable: false),
                    ShapeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "Talhao",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ZonaId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TemSvgShape = table.Column<bool>(type: "bit", nullable: false),
                    ShapeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "Sepultura",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TalhaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SepulturaTipoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SepulturaEstadoId = table.Column<int>(type: "int", nullable: false),
                    SepulturaSituacaoId = table.Column<int>(type: "int", nullable: false),
                    Largura = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Comprimento = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Area = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Profundidade = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    Fila = table.Column<string>(type: "varchar(10)", nullable: true),
                    Coluna = table.Column<string>(type: "varchar(10)", nullable: true),
                    DataConcessao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataInicioAluguer = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataFimAluguer = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataInicioReserva = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataFimReserva = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataConhecimento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataAnulacao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NumeroConhecimento = table.Column<string>(type: "varchar(10)", nullable: true),
                    Fundura1 = table.Column<bool>(type: "bit", nullable: false),
                    Fundura2 = table.Column<bool>(type: "bit", nullable: false),
                    Fundura3 = table.Column<bool>(type: "bit", nullable: false),
                    Anulado = table.Column<bool>(type: "bit", nullable: false),
                    Observacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bloqueada = table.Column<bool>(type: "bit", nullable: false),
                    Litigio = table.Column<bool>(type: "bit", nullable: true),
                    TemSvgShape = table.Column<bool>(type: "bit", nullable: false),
                    ShapeId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                schema: "Cemiterios",
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
                schema: "Cemiterios",
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
                name: "ProprietarioSepultura",
                schema: "Cemiterios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProprietarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SepulturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    IsProprietario = table.Column<bool>(type: "bit", nullable: false),
                    IsResponsavel = table.Column<bool>(type: "bit", nullable: false),
                    IsResponsavelGuiaReceita = table.Column<bool>(type: "bit", nullable: false),
                    DataInativacao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Fracao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Historico = table.Column<bool>(type: "bit", nullable: false),
                    Observacoes = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
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
                name: "IX_AgenciaFuneraria_EntidadeId",
                schema: "Cemiterios",
                table: "AgenciaFuneraria",
                column: "EntidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Cemiterio_CodigoPostalId",
                schema: "Cemiterios",
                table: "Cemiterio",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Concelho_DistritoId",
                schema: "Base",
                table: "Concelho",
                column: "DistritoId");

            migrationBuilder.CreateIndex(
                name: "IX_Coveiro_CodigoPostalId",
                schema: "Cemiterios",
                table: "Coveiro",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Coveiro_RuaId",
                schema: "Cemiterios",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AgenciaFuneraria",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Coveiro",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "DefuntoTipo",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "EntidadeContacto",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "ProprietarioSepultura",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Rubrica",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Proprietario",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Sepultura",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Entidade",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "SepulturaTipo",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Talhao",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Rua",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Epoca",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "SepulturaTipoDescricao",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Zona",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Freguesia",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Cemiterio",
                schema: "Cemiterios");

            migrationBuilder.DropTable(
                name: "Concelho",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "CodigoPostal",
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
