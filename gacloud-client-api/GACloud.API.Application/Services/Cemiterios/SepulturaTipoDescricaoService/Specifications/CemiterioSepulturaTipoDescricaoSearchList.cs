using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Specifications
{
  public class SepulturaTipoDescricaoSearchList
    : Specification<SepulturaTipoDescricao>
  {
    public SepulturaTipoDescricaoSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Descricao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

