using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.CorService.Filters
{
  public class CorTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public CorTableFilter()
    {
      Filters = [];
    }
  }
}