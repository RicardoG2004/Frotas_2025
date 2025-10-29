using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public class ModulosInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            Modulo[] modulos =
            [
                // Módulos for GSLP Manager (Gestão Interna)
                new()
                {
                    Id = Guid.Parse("00000001-0001-0000-0000-000000000000"),
                    Nome = "Gestão de Licenças",
                    Descricao = "Gerenciamento completo de licenças do sistema.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000001-0000-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0002-0000-0000-000000000000"),
                    Nome = "Gestão de Permissões",
                    Descricao = "Controle de acessos e permissões do sistema.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000001-0000-0000-0000-000000000000"),
                },
                // Módulos for Clicloud (Saúde)
                new()
                {
                    Id = Guid.Parse("00000002-0001-0000-0000-000000000000"),
                    Nome = "Gestão de Pacientes",
                    Descricao = "Gerenciamento de dados e histórico de pacientes.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000002-0002-0000-0000-000000000000"),
                    Nome = "Agendamento",
                    Descricao = "Sistema de agendamento de consultas e procedimentos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000002-0000-0000-0000-000000000000"),
                },
                // Módulos for GAcloud (Autarquias)
                new()
                {
                    Id = Guid.Parse("00000003-0001-0000-0000-000000000000"),
                    Nome = "Gestão de Processos",
                    Descricao = "Gerenciamento de processos municipais.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000003-0002-0000-0000-000000000000"),
                    Nome = "Atendimento ao Cidadão",
                    Descricao = "Portal de serviços e atendimento ao cidadão.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000"),
                },
                // Módulos for Realcloud (Empresarial)
                new()
                {
                    Id = Guid.Parse("00000004-0001-0000-0000-000000000000"),
                    Nome = "Gestão Financeira",
                    Descricao = "Controle financeiro e contabilidade empresarial.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000004-0000-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000004-0002-0000-0000-000000000000"),
                    Nome = "Recursos Humanos",
                    Descricao = "Gestão de pessoal e recursos humanos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000004-0000-0000-0000-000000000000"),
                },
                // Módulos for Tucloud (Turismo)
                new()
                {
                    Id = Guid.Parse("00000005-0001-0000-0000-000000000000"),
                    Nome = "Gestão de Reservas",
                    Descricao = "Sistema de reservas e gestão de ocupação.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000005-0000-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000005-0002-0000-0000-000000000000"),
                    Nome = "Pontos Turísticos",
                    Descricao = "Cadastro e gestão de pontos turísticos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    AplicacaoId = Guid.Parse("00000005-0000-0000-0000-000000000000"),
                },
            ];

            context.Modulos.AddRange(modulos);
        }
    }
}
