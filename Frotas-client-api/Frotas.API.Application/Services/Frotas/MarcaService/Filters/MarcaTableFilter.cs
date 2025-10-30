using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.MarcaService.Filters
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
