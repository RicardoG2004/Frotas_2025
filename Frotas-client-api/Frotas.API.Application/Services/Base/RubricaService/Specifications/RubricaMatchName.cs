using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.RubricaService.Specifications
{
  public class RubricaMatchName : Specification<Rubrica>
  {
    public RubricaMatchName(string? codigo)
    {
      if (!string.IsNullOrWhiteSpace(codigo))
      {
        _ = Query.Where(h => h.Codigo == codigo);
      }
      _ = Query.OrderBy(h => h.Codigo);
    }
  }
}
