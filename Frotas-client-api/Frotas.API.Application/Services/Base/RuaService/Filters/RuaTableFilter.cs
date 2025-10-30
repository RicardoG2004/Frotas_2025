using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.RuaService.Filters
{
  public class RuaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public RuaTableFilter()
    {
      Filters = [];
    }
  }
}
