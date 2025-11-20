using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguroService.Specifications
{
  public class SeguroById : Specification<Seguro>
  {
    public SeguroById(Guid id)
    {
      // include navigation properties
      _ = Query.Include(x => x.Seguradora);

      Query.Where(x => x.Id == id);
    }
  }
}

