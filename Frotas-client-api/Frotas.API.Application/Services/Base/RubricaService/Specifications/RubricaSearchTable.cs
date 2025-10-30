using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.RubricaService.Specifications
{
  public class RubricaSearchTable : Specification<Rubrica>
  {
    public RubricaSearchTable(
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
            case "codigo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Codigo.Contains(filter.Value));
              }
              break;
            case "epocaid":
              if (Guid.TryParse(filter.Value, out Guid epocaIdParam))
              {
                _ = Query.Where(x => x.EpocaId == epocaIdParam);
              }
              break;
            case "epoca.descricao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Epoca.Descricao.Contains(filter.Value));
              }
              break;
            case "classificacaotipo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.ClassificacaoTipo == filter.Value);
              }
              break;
            case "rubricatipo":
              if (int.TryParse(filter.Value, out int rubricaTipo))
              {
                _ = Query.Where(x => x.RubricaTipo == rubricaTipo);
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
