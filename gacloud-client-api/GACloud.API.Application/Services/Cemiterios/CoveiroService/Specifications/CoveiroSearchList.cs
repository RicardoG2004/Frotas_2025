using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService.Specifications
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
