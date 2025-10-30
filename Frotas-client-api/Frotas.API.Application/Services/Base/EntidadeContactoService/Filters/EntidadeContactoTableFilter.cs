using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.EntidadeContactoService.Filters
{
  public class EntidadeContactoTableFilter : PaginationFilter
  {
    public string? Keyword { get; set; }
  }
}
