using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.RuaService.Specifications
{
  public class RuaMatchNameAndLocation : Specification<Rua>
  {
    public RuaMatchNameAndLocation(string name, Guid freguesiaId, Guid codigoPostalId)
    {
      if (!string.IsNullOrWhiteSpace(name))
      {
        _ = Query.Where(h =>
          h.Nome == name && h.FreguesiaId == freguesiaId && h.CodigoPostalId == codigoPostalId
        );
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}
