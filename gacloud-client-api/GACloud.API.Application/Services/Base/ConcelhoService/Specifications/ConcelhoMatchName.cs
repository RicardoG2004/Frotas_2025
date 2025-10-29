using Ardalis.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.ConcelhoService.Specifications
{
  public class ConcelhoMatchName : Specification<Concelho>
  {
    public ConcelhoMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Nome == name);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}
