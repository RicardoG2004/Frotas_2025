using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService.Filters
{
  public class SeguradoraTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public SeguradoraTableFilter()
    {
      Filters = [];
    }
  }
}