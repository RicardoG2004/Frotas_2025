using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeService.Specifications
{
  public class EntidadeSearchTable : Specification<Entidade>
  {
    public EntidadeSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      // includes
      _ = Query.Include(x => x.CodigoPostal);
      _ = Query.Include(x => x.Pais);

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
            case "morada":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Morada.Contains(filter.Value));
              }
              break;
            case "localidade":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Localidade.Contains(filter.Value));
              }
              break;
            case "codigo_postal_id":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.CodigoPostalId == Guid.Parse(filter.Value));
              }
              break;
            case "pais_id":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.PaisId == Guid.Parse(filter.Value));
              }
              break;
            case "telefone":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Telefone.Contains(filter.Value));
              }
              break;
            case "fax":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Fax.Contains(filter.Value));
              }
              break;
            case "endereco_http":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.EnderecoHttp.Contains(filter.Value));
              }
              break;
            case "email":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Email.Contains(filter.Value));
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


