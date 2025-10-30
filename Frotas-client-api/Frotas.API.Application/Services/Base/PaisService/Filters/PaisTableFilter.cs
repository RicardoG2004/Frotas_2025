using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.PaisService.Filters
{
  public class PaisTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public PaisTableFilter()
    {
      Filters = [];
    }
  }
}
