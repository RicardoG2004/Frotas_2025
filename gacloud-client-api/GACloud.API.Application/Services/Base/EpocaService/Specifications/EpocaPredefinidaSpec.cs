using Ardalis.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.EpocaService.Specifications
{
  public class EpocaPredefinidaSpec : Specification<Epoca>
  {
    public EpocaPredefinidaSpec()
    {
      _ = Query.Where(x => x.Predefinida);
    }
  }
}
