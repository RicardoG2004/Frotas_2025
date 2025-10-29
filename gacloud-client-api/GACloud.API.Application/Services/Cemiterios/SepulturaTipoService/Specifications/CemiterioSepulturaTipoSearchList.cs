using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Specifications
{
  public class SepulturaTipoSearchList : Specification<SepulturaTipo>
  {
    public SepulturaTipoSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

