using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.ConcelhoService.Filters
{
  public class ConcelhoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ConcelhoTableFilter()
    {
      Filters = [];
    }
  }
}
