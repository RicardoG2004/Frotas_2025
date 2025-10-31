using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.CombustivelService.Specifications
{
  public class CombustivelMatchName : Specification<Combustivel>
  {
    public CombustivelMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}
