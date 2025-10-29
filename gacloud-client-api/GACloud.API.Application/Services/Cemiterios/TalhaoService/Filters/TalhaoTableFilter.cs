using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService.Filters
{
  public class TalhaoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }
    public Guid? CemiterioId { get; set; }

    public TalhaoTableFilter()
    {
      Filters = [];
    }
  }
}

