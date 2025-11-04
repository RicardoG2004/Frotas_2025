using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService.Filters
{
  public class EquipamentoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public EquipamentoTableFilter()
    {
      Filters = [];
    }
  }
}