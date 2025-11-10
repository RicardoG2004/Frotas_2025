using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguroService.Specifications
{
  public class SeguroMatchName : Specification<Seguro>
  {
    public SeguroMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}

