using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Application.ModuloService.Filters
{
    public class ModuloTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public ModuloTableFilter()
        {
            Filters = [];
        }
    }
}
