using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.ServicoService.Filters
{
  public class ServicoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ServicoTableFilter()
    {
      Filters = [];
    }
  }
}

