using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GSLPManager
{
    public class GSLPManagerFuncionalidadesInitializer : IDbInitializer
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
            ];

            // Get existing funcionalidade IDs to avoid duplicates
            List<Guid> existingFuncionalidadeIds = context.Funcionalidades.Select(f => f.Id).ToList();

            // Only add funcionalidades that don't already exist (by ID)
            List<Funcionalidade> funcionalidadesToAdd = funcionalidades
                .Where(f => !existingFuncionalidadeIds.Contains(f.Id))
                .ToList();

            if (funcionalidadesToAdd.Count != 0)
            {
                context.Funcionalidades.AddRange(funcionalidadesToAdd);
            }
        }
    }
}

