using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.RuaService.Filters
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
