using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.CoveiroService.Specifications
{
  public class CoveiroMatchName : Specification<Coveiro>
  {
    public CoveiroMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}
