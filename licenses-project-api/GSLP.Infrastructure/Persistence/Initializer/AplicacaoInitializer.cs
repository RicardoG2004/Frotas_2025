using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public class AplicacaoInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            Aplicacao[] aplicacoes =
            [
                // Gestão Interna
                new()
                {
                    Id = Guid.Parse("00000001-0000-0000-0000-000000000000"),
                    Nome = "GSLP Manager",
                    Descricao = "Sistema de gestão de licenças e permissões.",
                    Versao = "1.0.0",
                    FicheiroXAP = "gslp.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    AreaId = Guid.Parse("49b0eea1-673c-4db7-883a-45f50a82c1e6"), // Gestão Interna
                },
                // Saúde
                new()
                {
                    Id = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                    Nome = "Clicloud",
                    Descricao = "Sistema integrado de gestão clínica e hospitalar.",
                    Versao = "2.1.0",
                    FicheiroXAP = "Clicloud.xap",
                    Ativo = true,

                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    AreaId = Guid.Parse("7c421340-d0d3-45c9-b9c0-d6c9b0e36a5b"), // Saúde
                },
                // Autarquias
                new()
                {
                    Id = Guid.Parse("00000003-0000-0000-0000-000000000000"),
                    Nome = "GAcloud",
                    Descricao = "Plataforma de gestão municipal integrada.",
                    Versao = "3.0.0",
                    FicheiroXAP = "gacloud.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    AreaId = Guid.Parse("9e5c9f4a-3a1d-4c93-b2f8-4c8d59e8c5a1"), // Autarquias
                },
                // Empresarial
                new()
                {
                    Id = Guid.Parse("00000004-0000-0000-0000-000000000000"),
                    Nome = "Realcloud",
                    Descricao = "Sistema ERP completo para gestão empresarial.",
                    Versao = "2.5.0",
                    FicheiroXAP = "realcloud.xap",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),

                    AreaId = Guid.Parse("d2f1c5b8-8e4a-4b7c-9e3d-1d8b6f1c2a3b"), // Empresarial
                },
                // Turismo
                new()
                {
                    Id = Guid.Parse("00000005-0000-0000-0000-000000000000"),
                    Nome = "Tucloud",
                    Descricao = "Plataforma de gestão turística integrada.",
                    Versao = "1.5.0",
                    FicheiroXAP = "tucloud.xap",
                    Ativo = true,

                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    AreaId = Guid.Parse("f7e9c6d5-b4a3-4c2b-8d1e-9a7b6f5c4d3e"), // Turismo
                },
            ];

            context.Aplicacoes.AddRange(aplicacoes);
        }
    }
}
