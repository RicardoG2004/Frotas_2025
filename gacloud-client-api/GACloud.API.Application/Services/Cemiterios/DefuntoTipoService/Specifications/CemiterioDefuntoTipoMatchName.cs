using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.Specifications
{
  public class DefuntoTipoMatchName : Specification<DefuntoTipo>
  {
    public DefuntoTipoMatchName(string? description)
    {
      if (!string.IsNullOrWhiteSpace(description))
      {
        _ = Query.Where(h => h.Descricao == description);
      }
      _ = Query.OrderBy(h => h.Descricao);
    }
  }
}

