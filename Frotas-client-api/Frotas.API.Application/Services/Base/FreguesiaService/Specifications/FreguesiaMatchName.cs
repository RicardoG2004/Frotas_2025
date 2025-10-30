using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FreguesiaService.Specifications
{
  public class FreguesiaMatchName : Specification<Freguesia>
  {
    public FreguesiaMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Nome == name);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}
