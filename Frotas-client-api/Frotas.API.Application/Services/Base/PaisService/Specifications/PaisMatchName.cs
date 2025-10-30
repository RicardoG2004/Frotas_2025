using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.PaisService.Specifications
{
  public class PaisMatchName : Specification<Pais>
  {
    public PaisMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Nome == name);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}
