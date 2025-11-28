using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MakeMarcaIdAndModeloIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Viatura_Marca_MarcaId",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.DropForeignKey(
                name: "FK_Viatura_Modelo_ModeloId",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.AlterColumn<Guid>(
                name: "ModeloId",
                schema: "Frotas",
                table: "Viatura",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<Guid>(
                name: "MarcaId",
                schema: "Frotas",
                table: "Viatura",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Viatura_Marca_MarcaId",
                schema: "Frotas",
                table: "Viatura",
                column: "MarcaId",
                principalSchema: "Frotas",
                principalTable: "Marca",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Viatura_Modelo_ModeloId",
                schema: "Frotas",
                table: "Viatura",
                column: "ModeloId",
                principalSchema: "Frotas",
                principalTable: "Modelo",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Viatura_Marca_MarcaId",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.DropForeignKey(
                name: "FK_Viatura_Modelo_ModeloId",
                schema: "Frotas",
                table: "Viatura");

            migrationBuilder.AlterColumn<Guid>(
                name: "ModeloId",
                schema: "Frotas",
                table: "Viatura",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "MarcaId",
                schema: "Frotas",
                table: "Viatura",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Viatura_Marca_MarcaId",
                schema: "Frotas",
                table: "Viatura",
                column: "MarcaId",
                principalSchema: "Frotas",
                principalTable: "Marca",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Viatura_Modelo_ModeloId",
                schema: "Frotas",
                table: "Viatura",
                column: "ModeloId",
                principalSchema: "Frotas",
                principalTable: "Modelo",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

