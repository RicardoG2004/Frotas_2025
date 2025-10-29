using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.Specifications
{
  public class SepulturaMatchName : Specification<Sepultura>
  {
    public SepulturaMatchName(string? name)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h => h.Nome == name);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}

