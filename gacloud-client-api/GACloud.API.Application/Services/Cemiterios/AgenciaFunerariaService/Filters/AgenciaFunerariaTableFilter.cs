using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.Filters
{
  public class AgenciaFunerariaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public AgenciaFunerariaTableFilter()
    {
      Filters = [];
    }
  }
}

