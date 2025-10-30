using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.CoveiroService.Specifications
{
  public class CoveiroSearchList : Specification<Coveiro>
  {
    public CoveiroSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.Rua);
      _ = Query.Include(x => x.CodigoPostal);
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword) || x.NIF.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
