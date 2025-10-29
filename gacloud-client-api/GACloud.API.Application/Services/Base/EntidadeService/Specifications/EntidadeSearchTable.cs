using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.EntidadeService.Specifications
{
  public class EntidadeSearchTable : Specification<Entidade>
  {
    public EntidadeSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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
            case "nif":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.NIF.Contains(filter.Value));
              }
              break;
            case "rua.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Rua.Nome.Contains(filter.Value));
              }
              break;
            case "rua.freguesia.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Rua.Freguesia.Nome.Contains(filter.Value));
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
