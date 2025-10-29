using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.CoveiroService.Specifications
{
  public class CoveiroSearchTable : Specification<Coveiro>
  {
    public CoveiroSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      _ = Query.Include(x => x.Rua);
      _ = Query.Include(x => x.CodigoPostal);

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
            case "codigopostal.codigo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.CodigoPostal.Codigo.Contains(filter.Value));
              }
              break;
            case "historico":
              if (bool.TryParse(filter.Value, out bool historico))
              {
                _ = Query.Where(x => x.Historico == historico);
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
