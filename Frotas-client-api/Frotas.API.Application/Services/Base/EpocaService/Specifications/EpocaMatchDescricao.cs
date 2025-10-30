using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EpocaService.Specifications
{
  public class EpocaMatchDescricao : Specification<Epoca>
  {
    public EpocaMatchDescricao(string? descricao)
    {
      if (!string.IsNullOrWhiteSpace(descricao))
      {
        _ = Query.Where(h => h.Descricao == descricao);
      }
      _ = Query.OrderBy(h => h.Descricao);
    }
  }
}
