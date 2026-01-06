using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAppUpdateClienteJunctionTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUpdatesClientes",
                schema: "Aplicacao",
                columns: table => new
                {
                    AppUpdateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClienteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUpdatesClientes", x => new { x.AppUpdateId, x.ClienteId });
                    table.ForeignKey(
                        name: "FK_AppUpdatesClientes_AppUpdates_AppUpdateId",
                        column: x => x.AppUpdateId,
                        principalSchema: "Aplicacao",
                        principalTable: "AppUpdates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUpdatesClientes_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalSchema: "Plataforma",
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUpdatesClientes_ClienteId",
                schema: "Aplicacao",
                table: "AppUpdatesClientes",
                column: "ClienteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUpdatesClientes",
                schema: "Aplicacao");
        }
    }
}
