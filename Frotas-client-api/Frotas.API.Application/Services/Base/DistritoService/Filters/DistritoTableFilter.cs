using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.DistritoService.Filters
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
