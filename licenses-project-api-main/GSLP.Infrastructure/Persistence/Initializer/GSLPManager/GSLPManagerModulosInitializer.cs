using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GSLPManager
{
    public class GSLPManagerModulosInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            Guid gslpManagerAplicacaoId = Guid.Parse("00000001-0000-0000-0000-000000000000");

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
                    AplicacaoId = gslpManagerAplicacaoId,
                },
                new()
                {
                    Id = Guid.Parse("00000001-0002-0000-0000-000000000000"),
                    Nome = "Gestão de Permissões",
                    Descricao = "Controle de acessos e permissões do sistema.",
                    Ativo = true,
                    CreatedBy = Guid.Parse("1b77edb4-ae80-46b5-a388-d033eeddac1d"),
                    CreatedOn = new DateTime(2024, 12, 24, 10, 00, 00, DateTimeKind.Utc),
                    AplicacaoId = gslpManagerAplicacaoId,
                },
            ];

            // Get existing modulo IDs to avoid duplicates
            List<Guid> existingModuloIds = context.Modulos.Select(m => m.Id).ToList();

            // Only add modulos that don't already exist (by ID)
            List<Modulo> modulosToAdd = modulos.Where(m => !existingModuloIds.Contains(m.Id)).ToList();

            if (modulosToAdd.Count != 0)
            {
                context.Modulos.AddRange(modulosToAdd);
            }
        }
    }
}

