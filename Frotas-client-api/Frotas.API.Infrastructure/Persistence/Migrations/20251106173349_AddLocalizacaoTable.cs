using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddLocalizacaoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Localizacao",
                schema: "Base");
        }
    }
}
