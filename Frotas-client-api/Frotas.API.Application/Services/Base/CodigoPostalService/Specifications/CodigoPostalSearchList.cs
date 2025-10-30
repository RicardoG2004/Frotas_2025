using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.CodigoPostalService.Specifications
{
  public class CodigoPostalSearchList : Specification<CodigoPostal>
  {
    public CodigoPostalSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Codigo.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
