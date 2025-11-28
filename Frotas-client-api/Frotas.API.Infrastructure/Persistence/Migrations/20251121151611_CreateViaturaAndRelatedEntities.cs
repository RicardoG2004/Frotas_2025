using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateViaturaAndRelatedEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Viatura",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnoFabrico = table.Column<int?>(type: "int", nullable: true),
                    AnoImpostoCirculacao = table.Column<int?>(type: "int", nullable: true),
                    AnoImpostoSelo = table.Column<int?>(type: "int", nullable: true),
                    Autonomia = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    CapacidadeBateria = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    CargaUtil = table.Column<int?>(type: "int", nullable: true),
                    CartaoCombustivel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CategoriaId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    Cilindrada = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    CombustivelId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    Comprimento = table.Column<int?>(type: "int", nullable: true),
                    ConservatoriaId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    ConsumoEletrico = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    ConsumoMedio = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    Contrato = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CorId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    CountryCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Custo = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    DataAquisicao = table.Column<DateTime?>(type: "datetime2", nullable: true),
                    DataFinal = table.Column<DateTime?>(type: "datetime2", nullable: true),
                    DataInicial = table.Column<DateTime?>(type: "datetime2", nullable: true),
                    DataLivrete = table.Column<DateTime?>(type: "datetime2", nullable: true),
                    DataValidadeSelo = table.Column<DateTime?>(type: "datetime2", nullable: true),
                    DelegacaoId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    DespesasIncluidas = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    EmissoesCO2 = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    FornecedorId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    Largura = table.Column<int?>(type: "int", nullable: true),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true),
                    LocalizacaoId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    Lotacao = table.Column<int?>(type: "int", nullable: true),
                    MarcaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Marketing = table.Column<bool>(type: "bit", nullable: false),
                    Matricula = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Mercadorias = table.Column<bool>(type: "bit", nullable: false),
                    MesFabrico = table.Column<int?>(type: "int", nullable: true),
                    ModeloId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NMotor = table.Column<int?>(type: "int", nullable: true),
                    NQuadro = table.Column<int?>(type: "int", nullable: true),
                    NRendas = table.Column<int?>(type: "int", nullable: true),
                    NotasAdicionais = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Numero = table.Column<int?>(type: "int", nullable: true),
                    OpcaoCompra = table.Column<bool>(type: "bit", nullable: false),
                    PadraoCO2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PneusFrente = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PneusTras = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Potencia = table.Column<int?>(type: "int", nullable: true),
                    PotenciaCombinada = table.Column<int?>(type: "int", nullable: true),
                    PotenciaMotorEletrico = table.Column<int?>(type: "int", nullable: true),
                    SetorId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    Tara = table.Column<int?>(type: "int", nullable: true),
                    TempoCarregamento = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    TerceiroId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    TipoPropulsao = table.Column<int?>(type: "int", nullable: true),
                    TipoViaturaId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    URLImagem1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    URLImagem2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ValorRenda = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    ValorResidual = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    ValorTotalContrato = table.Column<decimal?>(type: "decimal(18,2)", nullable: true),
                    VoltagemTotal = table.Column<decimal?>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Viatura", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Viatura_Categoria_CategoriaId",
                        column: x => x.CategoriaId,
                        principalSchema: "Frotas",
                        principalTable: "Categoria",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Combustivel_CombustivelId",
                        column: x => x.CombustivelId,
                        principalSchema: "Frotas",
                        principalTable: "Combustivel",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Conservatoria_ConservatoriaId",
                        column: x => x.ConservatoriaId,
                        principalSchema: "Base",
                        principalTable: "Conservatoria",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Cor_CorId",
                        column: x => x.CorId,
                        principalSchema: "Frotas",
                        principalTable: "Cor",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Delegacao_DelegacaoId",
                        column: x => x.DelegacaoId,
                        principalSchema: "Base",
                        principalTable: "Delegacao",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Fornecedor_FornecedorId",
                        column: x => x.FornecedorId,
                        principalSchema: "Base",
                        principalTable: "Fornecedor",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Localizacao_LocalizacaoId",
                        column: x => x.LocalizacaoId,
                        principalSchema: "Base",
                        principalTable: "Localizacao",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Marca_MarcaId",
                        column: x => x.MarcaId,
                        principalSchema: "Frotas",
                        principalTable: "Marca",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Modelo_ModeloId",
                        column: x => x.ModeloId,
                        principalSchema: "Frotas",
                        principalTable: "Modelo",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Setor_SetorId",
                        column: x => x.SetorId,
                        principalSchema: "Base",
                        principalTable: "Setor",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_Terceiro_TerceiroId",
                        column: x => x.TerceiroId,
                        principalSchema: "Base",
                        principalTable: "Terceiro",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Viatura_TipoViatura_TipoViaturaId",
                        column: x => x.TipoViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "TipoViatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaEquipamento",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EquipamentoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaEquipamento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaEquipamento_Equipamento_EquipamentoId",
                        column: x => x.EquipamentoId,
                        principalSchema: "Frotas",
                        principalTable: "Equipamento",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaGarantia",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GarantiaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaGarantia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaGarantia_Garantia_GarantiaId",
                        column: x => x.GarantiaId,
                        principalSchema: "Base",
                        principalTable: "Garantia",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaGarantia_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaInspecao",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataInspecao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Resultado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataProximaInspecao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Documentos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaInspecao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaInspecao_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaCondutor",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FuncionarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaCondutor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaCondutor_Funcionario_FuncionarioId",
                        column: x => x.FuncionarioId,
                        principalSchema: "Base",
                        principalTable: "Funcionario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaCondutor_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaAcidente",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FuncionarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hora = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Culpa = table.Column<bool>(type: "bit", nullable: false),
                    DescricaoAcidente = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DescricaoDanos = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Local = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcelhoId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    FreguesiaId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    CodigoPostalId = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LocalReparacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaAcidente", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaAcidente_CodigoPostal_CodigoPostalId",
                        column: x => x.CodigoPostalId,
                        principalSchema: "Base",
                        principalTable: "CodigoPostal",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaAcidente_Concelho_ConcelhoId",
                        column: x => x.ConcelhoId,
                        principalSchema: "Base",
                        principalTable: "Concelho",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaAcidente_Freguesia_FreguesiaId",
                        column: x => x.FreguesiaId,
                        principalSchema: "Base",
                        principalTable: "Freguesia",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaAcidente_Funcionario_FuncionarioId",
                        column: x => x.FuncionarioId,
                        principalSchema: "Base",
                        principalTable: "Funcionario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaAcidente_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaMulta",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FuncionarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DataHora = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hora = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Local = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Motivo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaMulta", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaMulta_Funcionario_FuncionarioId",
                        column: x => x.FuncionarioId,
                        principalSchema: "Base",
                        principalTable: "Funcionario",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaMulta_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ViaturaSeguro",
                schema: "Frotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ViaturaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SeguroId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid?>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime?>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ViaturaSeguro", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ViaturaSeguro_Seguro_SeguroId",
                        column: x => x.SeguroId,
                        principalSchema: "Frotas",
                        principalTable: "Seguro",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ViaturaSeguro_Viatura_ViaturaId",
                        column: x => x.ViaturaId,
                        principalSchema: "Frotas",
                        principalTable: "Viatura",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_CategoriaId",
                schema: "Frotas",
                table: "Viatura",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_CombustivelId",
                schema: "Frotas",
                table: "Viatura",
                column: "CombustivelId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_ConservatoriaId",
                schema: "Frotas",
                table: "Viatura",
                column: "ConservatoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_CorId",
                schema: "Frotas",
                table: "Viatura",
                column: "CorId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_DelegacaoId",
                schema: "Frotas",
                table: "Viatura",
                column: "DelegacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_FornecedorId",
                schema: "Frotas",
                table: "Viatura",
                column: "FornecedorId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_LocalizacaoId",
                schema: "Frotas",
                table: "Viatura",
                column: "LocalizacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_MarcaId",
                schema: "Frotas",
                table: "Viatura",
                column: "MarcaId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_ModeloId",
                schema: "Frotas",
                table: "Viatura",
                column: "ModeloId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_SetorId",
                schema: "Frotas",
                table: "Viatura",
                column: "SetorId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_TerceiroId",
                schema: "Frotas",
                table: "Viatura",
                column: "TerceiroId");

            migrationBuilder.CreateIndex(
                name: "IX_Viatura_TipoViaturaId",
                schema: "Frotas",
                table: "Viatura",
                column: "TipoViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaEquipamento_EquipamentoId",
                schema: "Frotas",
                table: "ViaturaEquipamento",
                column: "EquipamentoId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaEquipamento_ViaturaId_EquipamentoId",
                schema: "Frotas",
                table: "ViaturaEquipamento",
                columns: new[] { "ViaturaId", "EquipamentoId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaGarantia_GarantiaId",
                schema: "Frotas",
                table: "ViaturaGarantia",
                column: "GarantiaId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaGarantia_ViaturaId_GarantiaId",
                schema: "Frotas",
                table: "ViaturaGarantia",
                columns: new[] { "ViaturaId", "GarantiaId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaInspecao_ViaturaId",
                schema: "Frotas",
                table: "ViaturaInspecao",
                column: "ViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaCondutor_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaCondutor",
                column: "FuncionarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaCondutor_ViaturaId_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaCondutor",
                columns: new[] { "ViaturaId", "FuncionarioId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaAcidente_CodigoPostalId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "CodigoPostalId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaAcidente_ConcelhoId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "ConcelhoId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaAcidente_FreguesiaId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "FreguesiaId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaAcidente_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "FuncionarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaAcidente_ViaturaId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "ViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaMulta_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaMulta",
                column: "FuncionarioId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaMulta_ViaturaId",
                schema: "Frotas",
                table: "ViaturaMulta",
                column: "ViaturaId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaSeguro_SeguroId",
                schema: "Frotas",
                table: "ViaturaSeguro",
                column: "SeguroId");

            migrationBuilder.CreateIndex(
                name: "IX_ViaturaSeguro_ViaturaId_SeguroId",
                schema: "Frotas",
                table: "ViaturaSeguro",
                columns: new[] { "ViaturaId", "SeguroId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ViaturaSeguro",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ViaturaMulta",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ViaturaInspecao",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ViaturaGarantia",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ViaturaEquipamento",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ViaturaCondutor",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "ViaturaAcidente",
                schema: "Frotas");

            migrationBuilder.DropTable(
                name: "Viatura",
                schema: "Frotas");
        }
    }
}
