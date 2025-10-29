using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Specifications
{
  public class SepulturaTipoDescricaoMatchName
    : Specification<SepulturaTipoDescricao>
  {
    public SepulturaTipoDescricaoMatchName(string? description)
    {
      if (!string.IsNullOrWhiteSpace(description))
      {
        _ = Query.Where(h => h.Descricao == description);
      }
      _ = Query.OrderBy(h => h.Descricao);
    }
  }
}

