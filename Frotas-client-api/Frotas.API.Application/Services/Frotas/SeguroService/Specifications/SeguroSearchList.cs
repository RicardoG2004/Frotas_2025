using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguroService.Specifications
{
  public class SeguroSearchList : Specification<Seguro>
  {
    public SeguroSearchList(string? keyword = "")
    {
      // include navigation properties
      _ = Query.Include(x => x.Seguradora);

      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword) || x.Apolice.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

