using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.GarantiaService.Filters
{
    public class GarantiaTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; } = new();
    }
}