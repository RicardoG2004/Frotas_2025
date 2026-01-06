using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Application.AplicacaoService.Filters
{
    public class AplicacaoTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public AplicacaoTableFilter()
        {
            Filters = [];
        }
    }
}
