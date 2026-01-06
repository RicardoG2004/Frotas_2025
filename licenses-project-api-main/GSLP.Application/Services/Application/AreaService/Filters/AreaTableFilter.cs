using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Application.AreaService.Filters
{
    public class AreaTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public AreaTableFilter()
        {
            Filters = [];
        }
    }
}
