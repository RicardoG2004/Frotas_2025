using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Frotas.ModeloService.Filters
{
  public class ModeloTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ModeloTableFilter()
    {
      Filters = [];
    }
  }
}
