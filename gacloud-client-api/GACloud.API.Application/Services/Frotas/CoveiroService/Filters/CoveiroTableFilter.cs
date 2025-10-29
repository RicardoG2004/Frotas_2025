using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Frotas.CoveiroService.Filters
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
