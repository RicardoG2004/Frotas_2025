using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService.Filters
{
  public class ZonaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }
    public Guid? CemiterioId { get; set; }

    public ZonaTableFilter()
    {
      Filters = [];
    }
  }
}

