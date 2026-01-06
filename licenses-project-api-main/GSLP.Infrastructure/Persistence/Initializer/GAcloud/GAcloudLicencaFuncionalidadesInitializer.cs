using GSLP.Domain.Entities.Catalog.Platform;
using GSLP.Infrastructure.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace GSLP.Infrastructure.Persistence.Initializer.GAcloud
{
  public class GAcloudLicencaFuncionalidadesInitializer : IDbInitializer
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

      // Get all GAcloud funcionalidades (by checking their Modulo's AplicacaoId)
      List<Guid> gacloudFuncionalidadeIds = context
        .Funcionalidades.Include(f => f.Modulo)
        .Where(f => f.Modulo.AplicacaoId == gacloudAplicacaoId && f.Ativo)
        .Select(f => f.Id)
        .ToList();

      if (gacloudFuncionalidadeIds.Count == 0)
      {
        // No GAcloud funcionalidades found, skip
        return;
      }

      // Get existing LicencaFuncionalidade relationships for this license
      List<Guid> existingFuncionalidadeIds = context
        .LicencasFuncionalidades.Where(lf => lf.LicencaId == cmbLicencaId)
        .Select(lf => lf.FuncionalidadeId)
        .ToList();

      // Create LicencaFuncionalidade relationships for all GAcloud funcionalidades
      foreach (Guid funcionalidadeId in gacloudFuncionalidadeIds)
      {
        // Skip if relationship already exists
        if (existingFuncionalidadeIds.Contains(funcionalidadeId))
        {
          continue;
        }

        LicencaFuncionalidade licencaFuncionalidade = new()
        {
          LicencaId = cmbLicencaId,
          FuncionalidadeId = funcionalidadeId,
        };

        context.LicencasFuncionalidades.Add(licencaFuncionalidade);
      }
    }
  }
}
