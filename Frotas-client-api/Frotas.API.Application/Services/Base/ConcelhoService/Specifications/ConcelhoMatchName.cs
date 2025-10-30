using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.ConcelhoService.Specifications
{
  public class ConcelhoMatchName : Specification<Concelho>
  {
    public ConcelhoMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Nome == name);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}
