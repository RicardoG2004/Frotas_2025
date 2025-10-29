using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.Filters
{
  public class DefuntoTipoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public DefuntoTipoTableFilter()
    {
      Filters = [];
    }
  }
}

