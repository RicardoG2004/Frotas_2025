using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.PecaService.Filters
{
  public class PecaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public PecaTableFilter()
    {
      Filters = [];
    }
  }
}

