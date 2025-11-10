using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService.Specifications
{
  public class SeguradoraSearchList : Specification<Seguradora>
  {
    public SeguradoraSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Descricao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

