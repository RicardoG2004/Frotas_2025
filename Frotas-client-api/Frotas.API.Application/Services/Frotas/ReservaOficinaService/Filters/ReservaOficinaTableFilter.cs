using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.Filters
{
  public class ReservaOficinaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ReservaOficinaTableFilter()
    {
      Filters = [];
    }
  }
}

