using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FornecedorService.Specifications
{
  public class FornecedorSearchTable : Specification<Fornecedor>
  {
    public FornecedorSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      // includes
      _ = Query.Include(x => x.CodigoPostalEscritorio);
      _ = Query.Include(x => x.PaisEscritorio);
      _ = Query.Include(x => x.CodigoPostalCarga);
      _ = Query.Include(x => x.PaisCarga);

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
            case "numcontribuinte":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.NumContribuinte.Contains(filter.Value));
              }
              break;
            case "moradaescritorio":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.MoradaEscritorio.Contains(filter.Value));
              }
              break;
            case "moradacarga":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.MoradaCarga.Contains(filter.Value));
              }
              break;
            case "origem":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Origem.Contains(filter.Value));
              }
              break;
            case "contacto":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Contacto.Contains(filter.Value));
              }
              break;
            case "telefone":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Telefone.Contains(filter.Value));
              }
              break;
            case "email":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Email.Contains(filter.Value));
              }
              break;
            case "ativo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                bool ativo = bool.Parse(filter.Value);
                _ = Query.Where(x => x.Ativo == ativo);
              }
              break;
            case "paisescritorio.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.PaisEscritorio.Nome.Contains(filter.Value));
              }
              break;
            case "paiscarga.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.PaisCarga.Nome.Contains(filter.Value));
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


