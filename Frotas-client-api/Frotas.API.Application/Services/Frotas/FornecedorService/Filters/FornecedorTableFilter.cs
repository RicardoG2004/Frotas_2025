using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.FornecedorService.Filters
{
  public class FornecedorTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public FornecedorTableFilter()
    {
      Filters = [];
    }
  }
}
