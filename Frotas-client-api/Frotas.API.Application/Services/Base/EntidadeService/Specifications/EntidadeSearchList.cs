using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeService.Specifications
{
  public class EntidadeSearchList : Specification<Entidade>
  {
    public EntidadeSearchList(string? keyword = "")
    {
      // includes
      _ = Query.Include(x => x.CodigoPostal);
      _ = Query.Include(x => x.Pais);

      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}


