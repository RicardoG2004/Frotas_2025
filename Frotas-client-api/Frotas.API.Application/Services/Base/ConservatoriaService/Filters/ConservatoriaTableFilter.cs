using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.ConservatoriaService.Filters
{
  public class ConservatoriaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ConservatoriaTableFilter()
    {
      Filters = [];
    }
  }
}