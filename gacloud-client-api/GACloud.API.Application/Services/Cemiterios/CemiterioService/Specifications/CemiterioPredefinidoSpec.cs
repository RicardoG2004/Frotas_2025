using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.CemiterioService.Specifications
{
  public class CemiterioPredefinidoSpec : Specification<Cemiterio>
  {
    public CemiterioPredefinidoSpec()
    {
      _ = Query.Where(x => x.Predefinido);
    }
  }
}

