using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.EpocaService.Specifications
{
  public class EpocaSearchTable : Specification<Epoca>
  {
    public EpocaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      // filters
      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "descricao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Descricao.Contains(filter.Value));
              }
              break;
            case "bloqueada":
              if (bool.TryParse(filter.Value, out bool bloqueada))
              {
                _ = Query.Where(x => x.Bloqueada == bloqueada);
              }
              break;
            case "predefinida":
              if (bool.TryParse(filter.Value, out bool predefinida))
              {
                _ = Query.Where(x => x.Predefinida == predefinida);
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

      // include related data
      // _ = Query.Include(x => x.EpocaAnterior);
    }
  }
}
