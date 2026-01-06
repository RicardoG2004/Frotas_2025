using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
  public class LicencasWithoutUpdater : LicencaAddAllIncludes
  {
    public LicencasWithoutUpdater(Guid updaterAppId, Guid gestaoInternaAreaId)
    {
      // Include all necessary navigation properties
      _ = Query.Include(l => l.Aplicacao).ThenInclude(a => a.Area);
      _ = Query.Include(l => l.Cliente);
      _ = Query.Include(l => l.LicencaAPIKey);

      // Exclude licenses from Gestão Interna area
      _ = Query.Where(l => l.Aplicacao != null && l.Aplicacao.AreaId != gestaoInternaAreaId);

      // Exclude Updater licenses themselves
      _ = Query.Where(l => l.AplicacaoId != updaterAppId);
    }
  }
}
