using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.CombustivelService.Filters
{
  public class CombustivelTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public CombustivelTableFilter()
    {
      Filters = [];
    }
  }
}
