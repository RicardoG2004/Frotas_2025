using Ardalis.Specification;
using GACloud.API.Application.Common.Filter;
using GACloud.API.Application.Common.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.Specifications
{
  public class SepulturaSearchTable : Specification<Sepultura>
  {
    public SepulturaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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
            case "Talhaoid":
              if (Guid.TryParse(filter.Value, out Guid TalhaoId))
              {
                _ = Query.Where(x => x.TalhaoId == TalhaoId);
              }
              break;
            case "Talhao.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.Talhao.Nome.Contains(filter.Value));
              }
              break;
            case "Sepulturatipoid":
              if (Guid.TryParse(filter.Value, out Guid SepulturaTipoId))
              {
                _ = Query.Where(x => x.SepulturaTipoId == SepulturaTipoId);
              }
              break;
            case "Sepulturatipo.nome":
              if (!string.IsNullOrWhiteSpace(filter.Value))
              {
                _ = Query.Where(x => x.SepulturaTipo.Nome.Contains(filter.Value));
              }
              break;
            case "Sepulturaestadoid":
              if (int.TryParse(filter.Value, out int SepulturaEstadoId))
              {
                _ = Query.Where(x => x.SepulturaEstadoId == SepulturaEstadoId);
              }
              break;
            case "litigio":
              if (bool.TryParse(filter.Value, out bool litigio))
              {
                _ = Query.Where(x => x.Litigio == litigio);
              }
              break;
            case "bloqueada":
              if (bool.TryParse(filter.Value, out bool bloqueada))
              {
                _ = Query.Where(x => x.Bloqueada == bloqueada);
              }
              break;
            case "Sepulturasituacaoid":
              if (int.TryParse(filter.Value, out int SepulturaSituacaoId))
              {
                _ = Query.Where(x =>
                  x.SepulturaSituacaoId == SepulturaSituacaoId
                );
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

