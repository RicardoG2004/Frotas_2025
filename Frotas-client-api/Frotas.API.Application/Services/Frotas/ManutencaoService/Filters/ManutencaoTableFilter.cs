using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.Filters
{
  public class ManutencaoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ManutencaoTableFilter()
    {
      Filters = [];
    }
  }
}

