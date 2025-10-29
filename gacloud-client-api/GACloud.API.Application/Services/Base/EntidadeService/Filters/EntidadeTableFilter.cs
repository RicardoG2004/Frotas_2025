using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.EntidadeService.Filters
{
  public class EntidadeTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public EntidadeTableFilter()
    {
      Filters = [];
    }
  }
}
