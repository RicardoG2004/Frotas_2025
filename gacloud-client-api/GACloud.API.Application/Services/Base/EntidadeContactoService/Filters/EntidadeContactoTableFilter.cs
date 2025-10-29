using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.Filters
{
  public class EntidadeContactoTableFilter : PaginationFilter
  {
    public string? Keyword { get; set; }
  }
}
