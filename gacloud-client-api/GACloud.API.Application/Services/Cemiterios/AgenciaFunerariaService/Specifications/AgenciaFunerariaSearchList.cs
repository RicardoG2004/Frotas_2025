using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.Specifications
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

