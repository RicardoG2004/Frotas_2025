using GSLP.Domain.Entities.Catalog.Application;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.Realcloud
{
    public class RealcloudModulosInitializer : IDbInitializer
    {
        public void Initialize(ApplicationDbContext context)
        {
            Guid realcloudAplicacaoId = Guid.Parse("00000004-0000-0000-0000-000000000000");

            // Realcloud modulos will be added here when needed
            Modulo[] modulos = [];

            if (modulos.Length == 0)
            {
                return;
            }

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

