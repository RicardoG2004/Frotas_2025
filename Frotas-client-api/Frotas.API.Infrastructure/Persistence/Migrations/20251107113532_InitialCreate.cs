using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Frotas.API.Infrastructure.Persistence.Migrations
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
                name: "Categoria",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categoria", x => x.Id);
                });

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
                name: "Combustivel",
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
                    table.PrimaryKey("PK_Combustivel", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cor",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cor", x => x.Id);
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
                name: "Equipamento",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Garantia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Obs = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipamento", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Garantia",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Anos = table.Column<int>(type: "int", nullable: false),
                    Kms = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Garantia", x => x.Id);
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
                name: "Setor",
                schema: "Base",
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
                    table.PrimaryKey("PK_Setor", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TaxaIva",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxaIva", x => x.Id);
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
                name: "Delegacao",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Morada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Localidade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PaisId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnderecoHttp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Delegacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Delegacao_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Delegacao_Pais_PaisId",
                        column: x => x.PaisId,
                        principalSchema: "Base",
                        principalTable: "Pais",
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

            migrationBuilder.CreateTable(
                name: "Peca",
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
                    table.PrimaryKey("PK_Peca", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Peca_TaxaIva_TaxaIvaId",
                        column: x => x.TaxaIvaId,
                        principalSchema: "Base",
                        principalTable: "TaxaIva",
                        principalColumn: "Id");
                });

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
                name: "Conservatoria",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Morada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FreguesiaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConcelhoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conservatoria", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Conservatoria_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Conservatoria_Concelho_ConcelhoId",
                        column: x => x.ConcelhoId,
                        principalSchema: "Base",
                        principalTable: "Concelho",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Conservatoria_Freguesia_FreguesiaId",
                        column: x => x.FreguesiaId,
                        principalSchema: "Base",
                        principalTable: "Freguesia",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Localizacao",
                schema: "Base",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Morada = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CodigoPostalId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FreguesiaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Telefone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Fax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localizacao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Localizacao_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Localizacao_Freguesia_FreguesiaId",
                        column: x => x.FreguesiaId,
                        principalSchema: "Base",
                        principalTable: "Freguesia",
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

            migrationBuilder.InsertData(
                schema: "Frotas",
                table: "Combustivel",
                columns: new[] { "Id", "CreatedBy", "CreatedOn", "LastModifiedBy", "LastModifiedOn", "Nome" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Gasolina 95" },
                    { new Guid("00000000-0000-0000-0000-000000000002"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Gasolina 98" },
                    { new Guid("00000000-0000-0000-0000-000000000003"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Gasolina E10" },
                    { new Guid("00000000-0000-0000-0000-000000000004"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "E85" },
                    { new Guid("00000000-0000-0000-0000-000000000005"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Gasóleo Simples" },
                    { new Guid("00000000-0000-0000-0000-000000000006"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Gasóleo Aditivado" },
                    { new Guid("00000000-0000-0000-0000-000000000007"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "Biodiesel" },
                    { new Guid("00000000-0000-0000-0000-000000000008"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "GPL/Autogás" },
                    { new Guid("00000000-0000-0000-0000-000000000009"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "GNV/Gás Natural Veicular" },
                    { new Guid("00000000-0000-0000-0000-00000000000a"), new Guid("00000000-0000-0000-0000-000000000000"), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, null, "ADBlue" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Concelho_DistritoId",
                schema: "Base",
                table: "Concelho",
                column: "DistritoId");

            migrationBuilder.CreateIndex(
                name: "IX_Conservatoria_CodigoPostalId",
                schema: "Base",
                table: "Conservatoria",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Conservatoria_ConcelhoId",
                schema: "Base",
                table: "Conservatoria",
                column: "ConcelhoId");

            migrationBuilder.CreateIndex(
                name: "IX_Conservatoria_FreguesiaId",
                schema: "Base",
                table: "Conservatoria",
                column: "FreguesiaId");

            migrationBuilder.CreateIndex(
                name: "IX_Delegacao_CodigoPostalId",
                schema: "Base",
                table: "Delegacao",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Delegacao_PaisId",
                schema: "Base",
                table: "Delegacao",
                column: "PaisId");

            migrationBuilder.CreateIndex(
                name: "IX_Distrito_PaisId",
                schema: "Base",
                table: "Distrito",
                column: "PaisId");

            migrationBuilder.CreateIndex(
                name: "IX_Epoca_EpocaAnteriorId",
                schema: "Base",
                table: "Epoca",
                column: "EpocaAnteriorId");

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

            migrationBuilder.CreateIndex(
                name: "IX_Freguesia_ConcelhoId",
                schema: "Base",
                table: "Freguesia",
                column: "ConcelhoId");

            migrationBuilder.CreateIndex(
                name: "IX_Localizacao_CodigoPostalId",
                schema: "Base",
                table: "Localizacao",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_Localizacao_FreguesiaId",
                schema: "Base",
                table: "Localizacao",
                column: "FreguesiaId");

            migrationBuilder.CreateIndex(
                name: "IX_Modelo_MarcaId",
                schema: "Frotas",
                table: "Modelo",
                column: "MarcaId");

            migrationBuilder.CreateIndex(
                name: "IX_Peca_TaxaIvaId",
                schema: "Frotas",
                table: "Peca",
                column: "TaxaIvaId");

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
                name: "IX_Servico_TaxaIvaId",
                schema: "Frotas",
                table: "Servico",
                column: "TaxaIvaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categoria",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Combustivel",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Conservatoria",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Cor",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Delegacao",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Equipamento",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Fornecedor",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Garantia",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Localizacao",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Modelo",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Peca",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Rubrica",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Servico",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Setor",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "Marca",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Epoca",
                schema: "Base");

            migrationBuilder.DropTable(
                name: "TaxaIva",
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
