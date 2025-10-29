using Ardalis.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.RubricaService.Specifications
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
