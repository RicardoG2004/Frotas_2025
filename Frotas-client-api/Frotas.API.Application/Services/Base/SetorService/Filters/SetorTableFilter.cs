using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.SetorService.Filters
{
  public class SetorTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public SetorTableFilter()
    {
      Filters = [];
    }
  }
}