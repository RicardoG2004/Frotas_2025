using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FuncionarioService.Specifications
{
  public class FuncionarioSearchTable : Specification<Funcionario>
  {
    public FuncionarioSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
    {
      // includes
      _ = Query.Include(x => x.CodigoPostal);
      _ = Query.Include(x => x.Freguesia);
      _ = Query.Include(x => x.Cargo);
      _ = Query.Include(x => x.Delegacao);

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
            case "email":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Email.Contains(filter.Value));
              }
              break;
            case "morada":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Morada.Contains(filter.Value));
              }
              break;
            case "freguesia":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Freguesia.Nome.Contains(filter.Value));
              }
              break;
            case "cargo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Cargo.Designacao.Contains(filter.Value));
              }
              break;
            case "delegacao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Delegacao.Designacao.Contains(filter.Value));
              }
              break;
            case "telefone":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Telefone.Contains(filter.Value));
              }
              break;
            case "ativo":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                bool ativo = bool.Parse(filter.Value);
                _ = Query.Where(x => x.Ativo == ativo);
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


