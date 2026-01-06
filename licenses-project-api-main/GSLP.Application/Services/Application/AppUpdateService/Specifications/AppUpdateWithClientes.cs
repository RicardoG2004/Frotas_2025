using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.AppUpdateService.Specifications
{
  public class AppUpdateWithClientes : Specification<AppUpdate>
  {
    public AppUpdateWithClientes(Guid appUpdateId)
    {
      Query.Where(au => au.Id == appUpdateId).Include(au => au.AppUpdatesClientes);
    }
  }
}


