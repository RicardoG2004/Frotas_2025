using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeService.Specifications
{
  public class EntidadeMatchName : Specification<Entidade>
  {
    public EntidadeMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Nome == name);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}
