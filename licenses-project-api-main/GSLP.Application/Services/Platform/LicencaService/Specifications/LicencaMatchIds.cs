using System;
using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
  public class LicencaMatchIds : LicencaAddAllIncludes
  {
    public LicencaMatchIds(List<Guid> licencaIds)
    {
      _ = Query.Where(l => licencaIds.Contains(l.Id));
    }
  }
}
