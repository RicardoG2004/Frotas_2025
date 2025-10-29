using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService.Specifications
{
  public class TalhaoSearchTable : Specification<Talhao>
  {
    public TalhaoSearchTable(
      List<TableFilter> filters,
      string? dynamicOrder = "",
      Guid? cemiterioId = null
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
            case "zonaid":
              if (Guid.TryParse(filter.Value, out Guid ZonaId))
              {
                _ = Query.Where(x => x.ZonaId == ZonaId);
              }
              break;
            case "zona.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Zona.Nome.Contains(filter.Value));
              }
              break;
            default:
              break;
          }
        }
      }

      // cemiterioId filter
      if (cemiterioId.HasValue)
      {
        _ = Query.Where(x => x.Zona.CemiterioId == cemiterioId.Value);
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
