using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Frotas.API.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddConservatoriaTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Conservatoria",
                schema: "Base");
        }
    }
}
