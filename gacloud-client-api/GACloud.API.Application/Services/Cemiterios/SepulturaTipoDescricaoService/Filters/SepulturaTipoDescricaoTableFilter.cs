using GACloud.API.Application.Common.Filter;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.Filters
{
  public class SepulturaTipoDescricaoTableFilter : PaginationFilter
  {
    public List<TableFilter> Filters { get; set; }

    public SepulturaTipoDescricaoTableFilter()
    {
      Filters = [];
    }
  }
}

