using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.CategoriaService.Specifications
{
  public class CategoriaMatchName : Specification<Categoria>
  {
    public CategoriaMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}

