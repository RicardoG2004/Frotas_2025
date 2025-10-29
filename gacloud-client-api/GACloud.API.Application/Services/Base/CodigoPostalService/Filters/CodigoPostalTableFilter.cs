using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.CodigoPostalService.Filters
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
