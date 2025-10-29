using Ardalis.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.CodigoPostalService.Specifications
{
  public class CodigoPostalMatchCodigo : Specification<CodigoPostal>
  {
    public CodigoPostalMatchCodigo(string? codigo)
    {
      if (!string.IsNullOrWhiteSpace(codigo))
      {
        _ = Query.Where(h => h.Codigo.Contains(codigo));
      }
      _ = Query.OrderBy(h => h.Codigo);
    }
  }
}
