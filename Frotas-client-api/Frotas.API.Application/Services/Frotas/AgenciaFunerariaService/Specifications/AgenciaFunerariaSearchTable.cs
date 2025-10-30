using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.Specifications
{
  public class AgenciaFunerariaSearchTable : Specification<AgenciaFuneraria>
  {
    public AgenciaFunerariaSearchTable(
      List<TableFilter> filters,
      string? dynamicOrder = ""
    )
    {
      _ = Query.Include(x => x.Entidade);

      // filters
      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "entidadeid":
              if (Guid.TryParse(filter.Value, out Guid entidadeId))
              {
                _ = Query.Where(x => x.EntidadeId == entidadeId);
              }
              break;
            case "entidade.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Entidade.Nome.Contains(filter.Value));
              }
              break;
            default:
              break;
          }
        }
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

