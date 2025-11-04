using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.PecaService.Specifications
{
  public class PecaSearchList : Specification<Peca>
  {
    public PecaSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.TaxaIva);
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

