using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer
{
    public class FuncionalidadesInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            Funcionalidade[] funcionalidades =
            [
                // Funcionalidades for GSLP Manager - Gestão de Licenças
                new()
                {
                    Id = Guid.Parse("00000001-0001-0001-0000-000000000000"),
                    Nome = "Criar Licença",
                    Descricao = "Permite criar novas licenças no sistema.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000001-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0001-0002-0000-000000000000"),
                    Nome = "Renovar Licença",
                    Descricao = "Permite renovar licenças existentes.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000001-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0001-0003-0000-000000000000"),
                    Nome = "Revogar Licença",
                    Descricao = "Permite revogar licenças ativas.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000001-0001-0000-0000-000000000000"),
                },
                // Funcionalidades for GSLP Manager - Gestão de Permissões
                new()
                {
                    Id = Guid.Parse("00000001-0002-0001-0000-000000000000"),
                    Nome = "Criar Perfil",
                    Descricao = "Permite criar novos perfis de acesso.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000001-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0002-0002-0000-000000000000"),
                    Nome = "Atribuir Permissões",
                    Descricao = "Permite atribuir permissões aos perfis.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000001-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000001-0002-0003-0000-000000000000"),
                    Nome = "Gerir Usuários",
                    Descricao = "Permite gerenciar usuários e suas permissões.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000001-0002-0000-0000-000000000000"),
                },
                // Funcionalidades for Clicloud - Gestão de Pacientes
                new()
                {
                    Id = Guid.Parse("00000002-0001-0001-0000-000000000000"),
                    Nome = "Cadastro de Pacientes",
                    Descricao = "Permite cadastrar novos pacientes no sistema.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000002-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000002-0001-0002-0000-000000000000"),
                    Nome = "Histórico Médico",
                    Descricao = "Gerencia o histórico médico dos pacientes.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000002-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000002-0001-0003-0000-000000000000"),
                    Nome = "Prontuário Eletrônico",
                    Descricao = "Gerencia prontuários eletrônicos dos pacientes.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000002-0001-0000-0000-000000000000"),
                },
                // Funcionalidades for Clicloud - Agendamento
                new()
                {
                    Id = Guid.Parse("00000002-0002-0001-0000-000000000000"),
                    Nome = "Marcar Consulta",
                    Descricao = "Permite agendar novas consultas médicas.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000002-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000002-0002-0002-0000-000000000000"),
                    Nome = "Cancelar Consulta",
                    Descricao = "Permite cancelar consultas agendadas.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000002-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000002-0002-0003-0000-000000000000"),
                    Nome = "Reagendar Consulta",
                    Descricao = "Permite alterar a data de consultas agendadas.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 01, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000002-0002-0000-0000-000000000000"),
                },
                // Funcionalidades for Frotas - Gestão de Processos
                new()
                {
                    Id = Guid.Parse("00000003-0001-0001-0000-000000000000"),
                    Nome = "Criar Processo",
                    Descricao = "Permite criar novos processos municipais.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000003-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000003-0001-0002-0000-000000000000"),
                    Nome = "Tramitar Processo",
                    Descricao = "Permite tramitar processos entre departamentos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000003-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000003-0001-0003-0000-000000000000"),
                    Nome = "Arquivar Processo",
                    Descricao = "Permite arquivar processos concluídos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000003-0001-0000-0000-000000000000"),
                },
                // Funcionalidades for Frotas - Atendimento ao Cidadão
                new()
                {
                    Id = Guid.Parse("00000003-0002-0001-0000-000000000000"),
                    Nome = "Agendar Atendimento",
                    Descricao = "Permite agendar atendimento presencial.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000003-0002-0002-0000-000000000000"),
                    Nome = "Registrar Solicitação",
                    Descricao = "Permite registrar solicitações dos cidadãos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000003-0002-0003-0000-000000000000"),
                    Nome = "Consultar Status",
                    Descricao = "Permite consultar status de solicitações.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 02, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000003-0002-0000-0000-000000000000"),
                },
                // Funcionalidades for Realcloud - Gestão Financeira
                new()
                {
                    Id = Guid.Parse("00000004-0001-0001-0000-000000000000"),
                    Nome = "Lançar Movimentação",
                    Descricao = "Permite registrar movimentações financeiras.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000004-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000004-0001-0002-0000-000000000000"),
                    Nome = "Gerar Relatório",
                    Descricao = "Permite gerar relatórios financeiros.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000004-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000004-0001-0003-0000-000000000000"),
                    Nome = "Conciliação Bancária",
                    Descricao = "Permite realizar conciliação bancária.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000004-0001-0000-0000-000000000000"),
                },
                // Funcionalidades for Realcloud - Recursos Humanos
                new()
                {
                    Id = Guid.Parse("00000004-0002-0001-0000-000000000000"),
                    Nome = "Cadastrar Funcionário",
                    Descricao = "Permite cadastrar novos funcionários.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000004-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000004-0002-0002-0000-000000000000"),
                    Nome = "Folha de Pagamento",
                    Descricao = "Permite gerenciar folha de pagamento.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000004-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000004-0002-0003-0000-000000000000"),
                    Nome = "Gestão de Férias",
                    Descricao = "Permite gerenciar férias dos funcionários.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 03, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000004-0002-0000-0000-000000000000"),
                },
                // Funcionalidades for Tucloud - Gestão de Reservas
                new()
                {
                    Id = Guid.Parse("00000005-0001-0001-0000-000000000000"),
                    Nome = "Criar Reserva",
                    Descricao = "Permite criar novas reservas.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000005-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000005-0001-0002-0000-000000000000"),
                    Nome = "Cancelar Reserva",
                    Descricao = "Permite cancelar reservas existentes.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000005-0001-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000005-0001-0003-0000-000000000000"),
                    Nome = "Alterar Reserva",
                    Descricao = "Permite modificar reservas existentes.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000005-0001-0000-0000-000000000000"),
                },
                // Funcionalidades for Tucloud - Pontos Turísticos
                new()
                {
                    Id = Guid.Parse("00000005-0002-0001-0000-000000000000"),
                    Nome = "Cadastrar Ponto",
                    Descricao = "Permite cadastrar novos pontos turísticos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000005-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000005-0002-0002-0000-000000000000"),
                    Nome = "Gerenciar Avaliações",
                    Descricao = "Permite gerenciar avaliações dos pontos turísticos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000005-0002-0000-0000-000000000000"),
                },
                new()
                {
                    Id = Guid.Parse("00000005-0002-0003-0000-000000000000"),
                    Nome = "Roteiros Turísticos",
                    Descricao = "Permite criar e gerenciar roteiros turísticos.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 04, 00, DateTimeKind.Utc),
                    ModuloId = Guid.Parse("00000005-0002-0000-0000-000000000000"),
                },
            ];

            context.Funcionalidades.AddRange(funcionalidades);
        }
    }
}
