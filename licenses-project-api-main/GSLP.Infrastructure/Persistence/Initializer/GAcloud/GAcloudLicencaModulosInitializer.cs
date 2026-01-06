using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudLicencaModulosInitializer : IDbInitializer
  {
    public void Initialize(ApplicationDbContext context)
    {
      // GAcloud CMB License ID
      Guid cmbLicencaId = Guid.Parse("C21D550C-5ECF-4486-CCD3-08DE33DCD237");

      // GAcloud Application ID
      Guid gacloudAplicacaoId = Guid.Parse("00000003-0000-0000-0000-000000000000");

      // Verify license exists
      bool licenseExists = context.Licencas.Any(l => l.Id == cmbLicencaId);
      if (!licenseExists)
      {
        // License doesn't exist yet, skip (it should be created by LicencasInitializer first)
        return;
      }

      // Get all GAcloud modulos
      List<Guid> gacloudModuloIds = context
        .Modulos.Where(m => m.AplicacaoId == gacloudAplicacaoId && m.Ativo)
        .Select(m => m.Id)
        .ToList();

      if (gacloudModuloIds.Count == 0)
      {
        // No GAcloud modulos found, skip
        return;
      }

      // Get existing LicencaModulo relationships for this license
      List<Guid> existingModuloIds = context
        .LicencasModulos.Where(lm => lm.LicencaId == cmbLicencaId)
        .Select(lm => lm.ModuloId)
        .ToList();

      // Create LicencaModulo relationships for all GAcloud modulos
      foreach (Guid moduloId in gacloudModuloIds)
      {
        // Skip if relationship already exists
        if (existingModuloIds.Contains(moduloId))
        {
          continue;
        }

        LicencaModulo licencaModulo = new() { LicencaId = cmbLicencaId, ModuloId = moduloId };

        context.LicencasModulos.Add(licencaModulo);
      }
    }
  }
}
