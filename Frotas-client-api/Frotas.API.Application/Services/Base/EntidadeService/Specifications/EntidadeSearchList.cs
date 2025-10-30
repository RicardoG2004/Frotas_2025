using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeService.Specifications
{
  public class EntidadeSearchList : Specification<Entidade>
  {
    public EntidadeSearchList(string? keyword = "")
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
