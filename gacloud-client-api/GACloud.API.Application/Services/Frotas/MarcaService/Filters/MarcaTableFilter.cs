using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Frotas.MarcaService.Filters
{
  public class MarcaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public MarcaTableFilter()
    {
      Filters = [];
    }
  }
}
