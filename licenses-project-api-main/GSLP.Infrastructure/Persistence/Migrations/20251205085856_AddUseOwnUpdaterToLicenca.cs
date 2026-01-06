using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUseOwnUpdaterToLicenca : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "UseOwnUpdater",
                schema: "Plataforma",
                table: "Licencas",
                type: "bit",
                nullable: true,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UseOwnUpdater",
                schema: "Plataforma",
                table: "Licencas");
        }
    }
}
