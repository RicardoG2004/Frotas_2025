using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Specifications
{
  public class SepulturaTipoSearchTable : Specification<SepulturaTipo>
  {
    public SepulturaTipoSearchTable(
      List<TableFilter> filters,
      string? dynamicOrder = "",
      Guid? epocaId = null
    )
    {
      // filters
      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Nome.Contains(filter.Value));
              }
              break;
            case "epoca.descricao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Epoca.Descricao.Contains(filter.Value));
              }
              break;
            case "Sepulturatipodescricao.descricao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x =>
                  x.SepulturaTipoDescricao.Descricao.Contains(filter.Value)
                );
              }
              break;
            default:
              break;
          }
        }
      }

      // epocaId filter
      if (epocaId.HasValue)
      {
        _ = Query.Where(x => x.EpocaId == epocaId.Value);
      }

      // sort order
      if (string.IsNullOrEmpty(dynamicOrder))
      {
        _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
      }
      else
      {
        _ = Query.OrderBy(dynamicOrder); // dynamic (JQDT) sort order
      }
    }
  }
}

