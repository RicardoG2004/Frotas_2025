using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.RuaService.Specifications
{
  public class RuaSearchTable : Specification<Rua>
  {
    public RuaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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
            case "freguesiaid":
              if (Guid.TryParse(filter.Value, out Guid freguesiaId))
              {
                _ = Query.Where(x => x.FreguesiaId == freguesiaId);
              }
              break;
            case "freguesia.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Freguesia.Nome.Contains(filter.Value));
              }
              break;
            case "codigopostalid":
              if (Guid.TryParse(filter.Value, out Guid codigoPostalId))
              {
                _ = Query.Where(x => x.CodigoPostalId == codigoPostalId);
              }
              break;
            case "codigopostal.codigo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.CodigoPostal.Codigo.Contains(filter.Value));
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
