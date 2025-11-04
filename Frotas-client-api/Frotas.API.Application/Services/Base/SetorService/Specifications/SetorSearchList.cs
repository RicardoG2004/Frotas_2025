using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.SetorService.Specifications
{
  public class SetorSearchList : Specification<Setor>
  {
    public SetorSearchList(string? keyword = "")
    {
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Descricao.Contains(keyword));
      }
      _ = Query.OrderByDescending(x => x.CreatedOn);
    }
  }
}