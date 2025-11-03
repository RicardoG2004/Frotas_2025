using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.Specifications
{
  public class TaxaIvaSearchTable : Specification<TaxaIva>
  {
    public TaxaIvaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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
                _ = Query.Where(x => x.Descricao.Contains(filter.Value));
              }
              break;
            case "valor":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Valor.ToString().Contains(filter.Value));
              }
              break;
            case "ativo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Ativo.ToString().Contains(filter.Value));
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
