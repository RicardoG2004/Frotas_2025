using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.Specifications
{
  public class AgenciaFunerariaSearchList : Specification<AgenciaFuneraria>
  {
    public AgenciaFunerariaSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.Entidade);
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Entidade.Nome.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

