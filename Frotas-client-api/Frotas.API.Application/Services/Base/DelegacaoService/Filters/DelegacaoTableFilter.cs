using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.DelegacaoService.Filters
{
  public class DelegacaoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public DelegacaoTableFilter()
    {
      Filters = [];
    }
  }
}