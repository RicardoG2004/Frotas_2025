using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.CorService.Specifications
{
  public class CorSearchList : Specification<Cor>
  {
    public CorSearchList(string? keyword = "")
    {
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn);
    }
  }
}


