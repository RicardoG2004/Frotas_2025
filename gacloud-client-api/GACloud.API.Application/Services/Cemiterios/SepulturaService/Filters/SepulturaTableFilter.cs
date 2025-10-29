using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.Filters
{
  public class SepulturaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public SepulturaTableFilter()
    {
      Filters = [];
    }
  }
}

