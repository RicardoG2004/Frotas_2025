using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.DelegacaoService.Specifications
{
  public class DelegacaoSearchList : Specification<Delegacao>
  {
    public DelegacaoSearchList(string? keyword = "")
    {
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword));
      }
      _ = Query.OrderByDescending(x => x.CreatedOn);
    }
  }
}