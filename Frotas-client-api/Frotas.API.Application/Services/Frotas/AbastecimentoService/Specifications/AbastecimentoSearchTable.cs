using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.Specifications
{
  public class AbastecimentoSearchTable : Specification<Abastecimento>
  {
    public AbastecimentoSearchTable(
      List<TableFilter> filters,
      string? dynamicOrder = ""
    )
    {
      _ = Query.Include(x => x.Funcionario);
      _ = Query.Include(x => x.Viatura);
      _ = Query.Include(x => x.Combustivel);

      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "funcionario":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Funcionario != null && x.Funcionario.Nome.Contains(filter.Value));
              }
              break;
            case "data":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                if (DateTime.TryParse(filter.Value, out DateTime dateValue))
                {
                  _ = Query.Where(x => x.Data.Date == dateValue.Date);
                }
              }
              break;
            case "viatura":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Viatura != null && x.Viatura.Matricula.Contains(filter.Value));
              }
              break;
            default:
              break;
          }
        }
      }

      if (string.IsNullOrEmpty(dynamicOrder))
      {
        _ = Query.OrderByDescending(x => x.Data);
      }
      else
      {
        _ = Query.OrderBy(dynamicOrder);
      }
    }
  }
}

