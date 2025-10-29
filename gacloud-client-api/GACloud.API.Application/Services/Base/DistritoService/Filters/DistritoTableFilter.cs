using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.DistritoService.Filters
{
  public class DistritoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public DistritoTableFilter()
    {
      Filters = [];
    }
  }
}
