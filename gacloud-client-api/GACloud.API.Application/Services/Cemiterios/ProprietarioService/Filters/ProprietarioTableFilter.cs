using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.Filters
{
  public class ProprietarioTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public ProprietarioTableFilter()
    {
      Filters = [];
    }
  }
}

