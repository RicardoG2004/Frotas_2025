using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.CemiterioService.Filters
{
  public class CemiterioTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public CemiterioTableFilter()
    {
      Filters = [];
    }
  }
}

