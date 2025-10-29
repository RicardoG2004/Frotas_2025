using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.FreguesiaService.Filters
{
  public class FreguesiaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public FreguesiaTableFilter()
    {
      Filters = [];
    }
  }
}
