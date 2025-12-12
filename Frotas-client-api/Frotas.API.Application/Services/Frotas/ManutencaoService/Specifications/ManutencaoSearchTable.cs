using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.Specifications
{
  public class ManutencaoSearchTable : Specification<Manutencao>
  {
    public ManutencaoSearchTable(
      List<TableFilter> filters,
      string? dynamicOrder = ""
    )
    {
      _ = Query.Include(x => x.Fse);
      _ = Query.Include(x => x.Funcionario);
      _ = Query.Include(x => x.Viatura);
      _ = Query.Include(x => x.ManutencaoServicos)
        .ThenInclude(x => x.Servico);
      _ = Query.Include(x => x.ManutencaoPecas)
        .ThenInclude(x => x.Peca);

      // filters
      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
          {
            case "matricula":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Viatura != null && x.Viatura.Matricula.Contains(filter.Value));
              }
              break;
            case "fse":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Fse != null && x.Fse.Nome.Contains(filter.Value));
              }
              break;
            case "funcionario":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Funcionario != null && x.Funcionario.Nome.Contains(filter.Value));
              }
              break;
            case "datarequisicao":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                if (DateTime.TryParse(filter.Value, out DateTime dateValue))
                {
                  _ = Query.Where(x => x.DataRequisicao.Date == dateValue.Date);
                }
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

