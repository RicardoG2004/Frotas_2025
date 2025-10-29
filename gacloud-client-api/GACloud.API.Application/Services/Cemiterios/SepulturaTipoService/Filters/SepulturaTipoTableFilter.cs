using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoService.Filters
{
  public class SepulturaTipoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }
    public Guid? EpocaId { get; set; }

    public SepulturaTipoTableFilter()
    {
      Filters = [];
    }
  }
}

