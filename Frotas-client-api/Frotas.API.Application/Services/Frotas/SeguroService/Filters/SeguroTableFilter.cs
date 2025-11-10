using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.SeguroService.Filters
{
  public class SeguroTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public SeguroTableFilter()
    {
      Filters = [];
    }
  }
}
