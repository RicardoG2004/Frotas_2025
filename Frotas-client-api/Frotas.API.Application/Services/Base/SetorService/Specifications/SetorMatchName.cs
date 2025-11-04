using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.SetorService.Specifications
{
  public class SetorMatchName : Specification<Setor>
  {
    public SetorMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Descricao == name);
      }
      _ = Query.OrderBy(h => h.Descricao);
    }
  }
}