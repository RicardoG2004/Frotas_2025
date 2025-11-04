using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.PecaService.Specifications
{
  public class PecaMatchName : Specification<Peca>
  {
    public PecaMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}

