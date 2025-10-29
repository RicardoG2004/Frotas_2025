using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService.Specifications
{
  public class ZonaSearchList : Specification<Zona>
  {
    public ZonaSearchList(string? keyword = "", string? cemiterioId = null)
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword));
      }

      if (
        !string.IsNullOrWhiteSpace(cemiterioId)
        && Guid.TryParse(cemiterioId, out Guid cemiterioIdGuid)
      )
      {
        _ = Query.Where(x => x.CemiterioId == cemiterioIdGuid);
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

