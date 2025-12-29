using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.Filters
{
  public class AbastecimentoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public AbastecimentoTableFilter()
    {
      Filters = [];
    }
  }
}

