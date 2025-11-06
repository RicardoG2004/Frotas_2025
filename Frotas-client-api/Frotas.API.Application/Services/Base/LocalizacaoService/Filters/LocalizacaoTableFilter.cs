using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.LocalizacaoService.Filters
{
    public class LocalizacaoTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public LocalizacaoTableFilter()
        {
            Filters = [];
        }
    }
}