using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.CorService.Specifications
{
  public class CorMatchName : Specification<Cor>
  {
    public CorMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}


