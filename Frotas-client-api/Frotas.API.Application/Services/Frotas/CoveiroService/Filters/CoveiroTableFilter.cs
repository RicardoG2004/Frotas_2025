using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.CoveiroService.Filters
{
  public class CoveiroTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public CoveiroTableFilter()
    {
      Filters = [];
    }
  }
}
