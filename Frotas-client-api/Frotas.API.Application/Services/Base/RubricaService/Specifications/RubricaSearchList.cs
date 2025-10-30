using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.RubricaService.Specifications
{
  public class RubricaSearchList : Specification<Rubrica>
  {
    public RubricaSearchList(string? keyword = "", string? epocaId = null)
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Codigo.Contains(keyword));
      }

      if (!string.IsNullOrWhiteSpace(epocaId) && Guid.TryParse(epocaId, out Guid epocaIdGuid))
      {
        _ = Query.Where(x => x.EpocaId == epocaIdGuid);
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
