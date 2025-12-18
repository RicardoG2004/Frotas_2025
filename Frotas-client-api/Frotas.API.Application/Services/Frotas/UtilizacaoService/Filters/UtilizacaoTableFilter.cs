using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.UtilizacaoService.Filters
{
  public class UtilizacaoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public UtilizacaoTableFilter()
    {
      Filters = [];
    }
  }
}

