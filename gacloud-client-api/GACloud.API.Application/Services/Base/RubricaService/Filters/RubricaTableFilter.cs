using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Base.RubricaService.Filters
{
  public class RubricaTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }
    public Guid? EpocaId { get; set; }

    public RubricaTableFilter()
    {
      Filters = [];
    }
  }
}
