using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FreguesiaService.Specifications
{
  public class FreguesiaSearchList : Specification<Freguesia>
  {
    public FreguesiaSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
