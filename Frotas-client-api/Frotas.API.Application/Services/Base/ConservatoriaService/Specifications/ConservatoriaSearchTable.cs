using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.ConservatoriaService.Specifications
{
  public class ConservatoriaSearchTable : Specification<Conservatoria>
  {
    public ConservatoriaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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
            case "morada":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Morada.Contains(filter.Value));
              }
              break;
            case "codigopostalid":
              if (Guid.TryParse(filter.Value, out Guid codigoPostalId))
              {
                _ = Query.Where(x => x.CodigoPostalId == codigoPostalId);
              }
              break;
            case "freguesiaid":
              if (Guid.TryParse(filter.Value, out Guid freguesiaId))
              {
                _ = Query.Where(x => x.FreguesiaId == freguesiaId);
              }
              break;
            case "concelhoid":
              if (Guid.TryParse(filter.Value, out Guid concelhoId))
              {
                _ = Query.Where(x => x.ConcelhoId == concelhoId);
              }
              break;
            case "concelho.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Concelho.Nome.Contains(filter.Value));
              }
              break;
            case "telefone":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Telefone.Contains(filter.Value));
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
