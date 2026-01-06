using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.Realcloud
{
    public class RealcloudFuncionalidadesInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            // Realcloud funcionalidades will be added here when needed
            Funcionalidade[] funcionalidades = [];

            if (funcionalidades.Length == 0)
            {
                return;
            }

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

