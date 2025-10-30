using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.CodigoPostalService.Filters
{
  public class CodigoPostalTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public CodigoPostalTableFilter()
    {
      Filters = [];
    }
  }
}
