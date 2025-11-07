using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.Specifications
{
  public class TipoViaturaSearchList : Specification<TipoViatura>
  {
    public TipoViaturaSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
