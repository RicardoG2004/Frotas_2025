using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureCascadeDeleteViaturaRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_CodigoPostal_CodigoPostalId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Concelho_ConcelhoId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Freguesia_FreguesiaId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaCondutor_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaCondutor");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaCondutor_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaCondutor");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaEquipamento_Equipamento_EquipamentoId",
                schema: "Frotas",
                table: "ViaturaEquipamento");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaEquipamento");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaGarantia_Garantia_GarantiaId",
                schema: "Frotas",
                table: "ViaturaGarantia");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaGarantia_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaGarantia");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaInspecao_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaInspecao");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaMulta_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaMulta_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaSeguro_Seguro_SeguroId",
                schema: "Frotas",
                table: "ViaturaSeguro");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaSeguro_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaSeguro");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_CodigoPostal_CodigoPostalId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "CodigoPostalId",
                principalSchema: "Base",
                principalTable: "CodigoPostal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Concelho_ConcelhoId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "ConcelhoId",
                principalSchema: "Base",
                principalTable: "Concelho",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Freguesia_FreguesiaId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "FreguesiaId",
                principalSchema: "Base",
                principalTable: "Freguesia",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "FuncionarioId",
                principalSchema: "Base",
                principalTable: "Funcionario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaCondutor_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaCondutor",
                column: "FuncionarioId",
                principalSchema: "Base",
                principalTable: "Funcionario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaCondutor_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaCondutor",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaEquipamento_Equipamento_EquipamentoId",
                schema: "Frotas",
                table: "ViaturaEquipamento",
                column: "EquipamentoId",
                principalSchema: "Frotas",
                principalTable: "Equipamento",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaEquipamento",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaGarantia_Garantia_GarantiaId",
                schema: "Frotas",
                table: "ViaturaGarantia",
                column: "GarantiaId",
                principalSchema: "Base",
                principalTable: "Garantia",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaGarantia_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaGarantia",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaInspecao_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaInspecao",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaMulta_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaMulta",
                column: "FuncionarioId",
                principalSchema: "Base",
                principalTable: "Funcionario",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaMulta_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaMulta",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaSeguro_Seguro_SeguroId",
                schema: "Frotas",
                table: "ViaturaSeguro",
                column: "SeguroId",
                principalSchema: "Frotas",
                principalTable: "Seguro",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaSeguro_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaSeguro",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_CodigoPostal_CodigoPostalId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Concelho_ConcelhoId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Freguesia_FreguesiaId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaAcidente_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaAcidente");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaCondutor_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaCondutor");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaCondutor_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaCondutor");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaEquipamento_Equipamento_EquipamentoId",
                schema: "Frotas",
                table: "ViaturaEquipamento");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaEquipamento");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaGarantia_Garantia_GarantiaId",
                schema: "Frotas",
                table: "ViaturaGarantia");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaGarantia_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaGarantia");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaInspecao_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaInspecao");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaMulta_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaMulta_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaMulta");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaSeguro_Seguro_SeguroId",
                schema: "Frotas",
                table: "ViaturaSeguro");

            migrationBuilder.DropForeignKey(
                name: "FK_ViaturaSeguro_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaSeguro");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_CodigoPostal_CodigoPostalId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "CodigoPostalId",
                principalSchema: "Base",
                principalTable: "CodigoPostal",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Concelho_ConcelhoId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "ConcelhoId",
                principalSchema: "Base",
                principalTable: "Concelho",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Freguesia_FreguesiaId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "FreguesiaId",
                principalSchema: "Base",
                principalTable: "Freguesia",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "FuncionarioId",
                principalSchema: "Base",
                principalTable: "Funcionario",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaAcidente_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaAcidente",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaCondutor_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaCondutor",
                column: "FuncionarioId",
                principalSchema: "Base",
                principalTable: "Funcionario",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaCondutor_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaCondutor",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaEquipamento_Equipamento_EquipamentoId",
                schema: "Frotas",
                table: "ViaturaEquipamento",
                column: "EquipamentoId",
                principalSchema: "Frotas",
                principalTable: "Equipamento",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaEquipamento_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaEquipamento",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaGarantia_Garantia_GarantiaId",
                schema: "Frotas",
                table: "ViaturaGarantia",
                column: "GarantiaId",
                principalSchema: "Base",
                principalTable: "Garantia",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaGarantia_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaGarantia",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaInspecao_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaInspecao",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaMulta_Funcionario_FuncionarioId",
                schema: "Frotas",
                table: "ViaturaMulta",
                column: "FuncionarioId",
                principalSchema: "Base",
                principalTable: "Funcionario",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaMulta_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaMulta",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaSeguro_Seguro_SeguroId",
                schema: "Frotas",
                table: "ViaturaSeguro",
                column: "SeguroId",
                principalSchema: "Frotas",
                principalTable: "Seguro",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ViaturaSeguro_Viatura_ViaturaId",
                schema: "Frotas",
                table: "ViaturaSeguro",
                column: "ViaturaId",
                principalSchema: "Frotas",
                principalTable: "Viatura",
                principalColumn: "Id");
        }
    }
}
