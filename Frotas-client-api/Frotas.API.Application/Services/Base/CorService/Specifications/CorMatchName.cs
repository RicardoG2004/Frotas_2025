using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.CorService.Specifications
{
  public class CorMatchName : Specification<Cor>
  {
    public CorMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Designacao == name);
      }
      _ = Query.OrderBy(h => h.Designacao);
    }
  }
}
