using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.CategoriaService.Filters
{
  public class CategoriaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public CategoriaTableFilter()
    {
      Filters = [];
    }
  }
}
