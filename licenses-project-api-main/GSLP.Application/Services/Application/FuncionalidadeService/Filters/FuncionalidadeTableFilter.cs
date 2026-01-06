using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Filters
{
    public class FuncionalidadeTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public FuncionalidadeTableFilter()
        {
            Filters = [];
        }
    }
}
