using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.Specifications
{
  public class ProprietarioSearchTable : Specification<Proprietario>
  {
    public ProprietarioSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      _ = Query.Include(x => x.Entidade).Include(x => x.Cemiterio);

      // filters
      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "cemiterioid":
              if (Guid.TryParse(filter.Value, out Guid cemiterioId))
              {
                _ = Query.Where(x => x.CemiterioId == cemiterioId);
              }
              break;
            case "cemiterio.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Cemiterio.Nome.Contains(filter.Value));
              }
              break;
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

