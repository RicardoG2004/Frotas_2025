using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.Specifications
{
  public class TipoViaturaMatchName : Specification<TipoViatura>
  {
    public TipoViaturaMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}