using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EpocaService.Specifications
{
  public class EpocaPredefinidaSpec : Specification<Epoca>
  {
    public EpocaPredefinidaSpec()
    {
      _ = Query.Where(x => x.Predefinida);
    }
  }
}
