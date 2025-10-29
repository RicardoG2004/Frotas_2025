using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.ConcelhoService.Filters
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
