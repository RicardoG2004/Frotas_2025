using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.DelegacaoService.Specifications
{
  public class DelegacaoMatchName : Specification<Delegacao>
  {
    public DelegacaoMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Designacao == name);
      }
      _ = Query.OrderBy(h => h.Designacao);
    }
  }
}