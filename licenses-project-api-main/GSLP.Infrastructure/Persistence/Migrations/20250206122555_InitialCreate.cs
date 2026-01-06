using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GSLP.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Aplicacao");

            migrationBuilder.EnsureSchema(
                name: "Plataforma");

            migrationBuilder.EnsureSchema(
                name: "Identity");

            migrationBuilder.CreateTable(
                name: "Areas",
                schema: "Aplicacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Areas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clientes",
                schema: "Plataforma",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    Sigla = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NIF = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DadosExternos = table.Column<bool>(type: "bit", nullable: false),
                    DadosUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                schema: "Identity",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Aplicacoes",
                schema: "Aplicacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Versao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FicheiroXAP = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    AreaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aplicacoes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Aplicacoes_Areas_AreaId",
                        column: x => x.AreaId,
                        principalSchema: "Aplicacao",
                        principalTable: "Areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Identity",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshTokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ClienteId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalSchema: "Plataforma",
                        principalTable: "Clientes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "RoleClaims",
                schema: "Identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RoleClaims_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Identity",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Licencas",
                schema: "Plataforma",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DataInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataFim = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NumeroUtilizadores = table.Column<int>(type: "int", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    Bloqueada = table.Column<bool>(type: "bit", nullable: false),
                    DataBloqueio = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MotivoBloqueio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AplicacaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClienteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LicencaAPIKeyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Licencas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Licencas_Aplicacoes_AplicacaoId",
                        column: x => x.AplicacaoId,
                        principalSchema: "Aplicacao",
                        principalTable: "Aplicacoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Licencas_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalSchema: "Plataforma",
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Modulos",
                schema: "Aplicacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    AplicacaoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modulos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Modulos_Aplicacoes_AplicacaoId",
                        column: x => x.AplicacaoId,
                        principalSchema: "Aplicacao",
                        principalTable: "Aplicacoes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserClaims",
                schema: "Identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserClaims_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLogins",
                schema: "Identity",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_UserLogins_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                schema: "Identity",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Identity",
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                schema: "Identity",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_UserTokens_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LicencasAPIKeys",
                schema: "Plataforma",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    APIKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    LicencaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicencasAPIKeys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicencasAPIKeys_Licencas_LicencaId",
                        column: x => x.LicencaId,
                        principalSchema: "Plataforma",
                        principalTable: "Licencas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LicencasUtilizadores",
                schema: "Plataforma",
                columns: table => new
                {
                    LicencaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UtilizadorId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Ativo = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicencasUtilizadores", x => new { x.LicencaId, x.UtilizadorId });
                    table.ForeignKey(
                        name: "FK_LicencasUtilizadores_Licencas_LicencaId",
                        column: x => x.LicencaId,
                        principalSchema: "Plataforma",
                        principalTable: "Licencas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicencasUtilizadores_Users_UtilizadorId",
                        column: x => x.UtilizadorId,
                        principalSchema: "Identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Perfis",
                schema: "Plataforma",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    LicencaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Perfis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Perfis_Licencas_LicencaId",
                        column: x => x.LicencaId,
                        principalSchema: "Plataforma",
                        principalTable: "Licencas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Funcionalidades",
                schema: "Aplicacao",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ativo = table.Column<bool>(type: "bit", nullable: false),
                    ModuloId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Funcionalidades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Funcionalidades_Modulos_ModuloId",
                        column: x => x.ModuloId,
                        principalSchema: "Aplicacao",
                        principalTable: "Modulos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LicencasModulos",
                schema: "Plataforma",
                columns: table => new
                {
                    LicencaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ModuloId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicencasModulos", x => new { x.LicencaId, x.ModuloId });
                    table.ForeignKey(
                        name: "FK_LicencasModulos_Licencas_LicencaId",
                        column: x => x.LicencaId,
                        principalSchema: "Plataforma",
                        principalTable: "Licencas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicencasModulos_Modulos_ModuloId",
                        column: x => x.ModuloId,
                        principalSchema: "Aplicacao",
                        principalTable: "Modulos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PerfisUtilizadores",
                schema: "Plataforma",
                columns: table => new
                {
                    PerfilId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UtilizadorId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerfisUtilizadores", x => new { x.PerfilId, x.UtilizadorId });
                    table.ForeignKey(
                        name: "FK_PerfisUtilizadores_Perfis_PerfilId",
                        column: x => x.PerfilId,
                        principalSchema: "Plataforma",
                        principalTable: "Perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerfisUtilizadores_Users_UtilizadorId",
                        column: x => x.UtilizadorId,
                        principalSchema: "Identity",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LicencasFuncionalidades",
                schema: "Plataforma",
                columns: table => new
                {
                    LicencaId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FuncionalidadeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicencasFuncionalidades", x => new { x.LicencaId, x.FuncionalidadeId });
                    table.ForeignKey(
                        name: "FK_LicencasFuncionalidades_Funcionalidades_FuncionalidadeId",
                        column: x => x.FuncionalidadeId,
                        principalSchema: "Aplicacao",
                        principalTable: "Funcionalidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicencasFuncionalidades_Licencas_LicencaId",
                        column: x => x.LicencaId,
                        principalSchema: "Plataforma",
                        principalTable: "Licencas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PerfisFuncionalidades",
                schema: "Plataforma",
                columns: table => new
                {
                    PerfilId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FuncionalidadeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AuthVer = table.Column<bool>(type: "bit", nullable: false),
                    AuthAdd = table.Column<bool>(type: "bit", nullable: false),
                    AuthChg = table.Column<bool>(type: "bit", nullable: false),
                    AuthDel = table.Column<bool>(type: "bit", nullable: false),
                    AuthPrt = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PerfisFuncionalidades", x => new { x.PerfilId, x.FuncionalidadeId });
                    table.ForeignKey(
                        name: "FK_PerfisFuncionalidades_Funcionalidades_FuncionalidadeId",
                        column: x => x.FuncionalidadeId,
                        principalSchema: "Aplicacao",
                        principalTable: "Funcionalidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PerfisFuncionalidades_Perfis_PerfilId",
                        column: x => x.PerfilId,
                        principalSchema: "Plataforma",
                        principalTable: "Perfis",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Aplicacoes_AreaId",
                schema: "Aplicacao",
                table: "Aplicacoes",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Funcionalidades_ModuloId",
                schema: "Aplicacao",
                table: "Funcionalidades",
                column: "ModuloId");

            migrationBuilder.CreateIndex(
                name: "IX_Licencas_AplicacaoId",
                schema: "Plataforma",
                table: "Licencas",
                column: "AplicacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Licencas_ClienteId",
                schema: "Plataforma",
                table: "Licencas",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "IX_LicencasAPIKeys_LicencaId",
                schema: "Plataforma",
                table: "LicencasAPIKeys",
                column: "LicencaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicencasFuncionalidades_FuncionalidadeId",
                schema: "Plataforma",
                table: "LicencasFuncionalidades",
                column: "FuncionalidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_LicencasModulos_ModuloId",
                schema: "Plataforma",
                table: "LicencasModulos",
                column: "ModuloId");

            migrationBuilder.CreateIndex(
                name: "IX_LicencasUtilizadores_UtilizadorId",
                schema: "Plataforma",
                table: "LicencasUtilizadores",
                column: "UtilizadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Modulos_AplicacaoId",
                schema: "Aplicacao",
                table: "Modulos",
                column: "AplicacaoId");

            migrationBuilder.CreateIndex(
                name: "IX_Perfis_LicencaId",
                schema: "Plataforma",
                table: "Perfis",
                column: "LicencaId");

            migrationBuilder.CreateIndex(
                name: "IX_PerfisFuncionalidades_FuncionalidadeId",
                schema: "Plataforma",
                table: "PerfisFuncionalidades",
                column: "FuncionalidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_PerfisUtilizadores_UtilizadorId",
                schema: "Plataforma",
                table: "PerfisUtilizadores",
                column: "UtilizadorId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleClaims_RoleId",
                schema: "Identity",
                table: "RoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "Identity",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_UserClaims_UserId",
                schema: "Identity",
                table: "UserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLogins_UserId",
                schema: "Identity",
                table: "UserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                schema: "Identity",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "Identity",
                table: "Users",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ClienteId",
                schema: "Identity",
                table: "Users",
                column: "ClienteId");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "Identity",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LicencasAPIKeys",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "LicencasFuncionalidades",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "LicencasModulos",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "LicencasUtilizadores",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "PerfisFuncionalidades",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "PerfisUtilizadores",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "RoleClaims",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "UserClaims",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "UserLogins",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "UserRoles",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "UserTokens",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "Funcionalidades",
                schema: "Aplicacao");

            migrationBuilder.DropTable(
                name: "Perfis",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "Roles",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Identity");

            migrationBuilder.DropTable(
                name: "Modulos",
                schema: "Aplicacao");

            migrationBuilder.DropTable(
                name: "Licencas",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "Aplicacoes",
                schema: "Aplicacao");

            migrationBuilder.DropTable(
                name: "Clientes",
                schema: "Plataforma");

            migrationBuilder.DropTable(
                name: "Areas",
                schema: "Aplicacao");
        }
    }
}
