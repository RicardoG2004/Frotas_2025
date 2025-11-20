using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguroService.Specifications
{
  public class SeguroSearchTable : Specification<Seguro>
  {
    public SeguroSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      // include navigation properties
      _ = Query.Include(x => x.Seguradora);

      // filters
      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "designacao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Designacao.Contains(filter.Value));
              }
              break;
            case "apolice":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Apolice.Contains(filter.Value));
              }
              break;
            case "seguradora.descricao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Seguradora.Descricao.Contains(filter.Value));
              }
              break;
            case "assistenciaviagem":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.AssistenciaViagem == bool.Parse(filter.Value));
              }
              break;
            case "cartaverde":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.CartaVerde == bool.Parse(filter.Value));
              }
              break;
            case "valorcobertura":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.ValorCobertura == decimal.Parse(filter.Value));
              }
              break;
            case "custoanual":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.CustoAnual == decimal.Parse(filter.Value));
              }
              break;
            case "riscoscobertos":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.RiscosCobertos.Contains(filter.Value));
              }
              break;
            case "datainicial":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.DataInicial == DateTime.Parse(filter.Value));
                _ = Query.Where(x => x.DataFinal == DateTime.Parse(filter.Value));
              }
              break;
            case "datafinal":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.DataFinal == DateTime.Parse(filter.Value));
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

