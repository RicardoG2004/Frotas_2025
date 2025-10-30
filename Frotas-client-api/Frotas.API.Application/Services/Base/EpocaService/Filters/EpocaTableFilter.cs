using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.EpocaService.Filters
{
  public class EpocaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public EpocaTableFilter()
    {
      Filters = [];
    }
  }
}
