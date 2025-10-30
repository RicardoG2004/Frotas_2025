using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.Filters
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

