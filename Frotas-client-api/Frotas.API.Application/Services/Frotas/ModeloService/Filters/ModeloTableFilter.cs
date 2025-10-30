using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.ModeloService.Filters
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
