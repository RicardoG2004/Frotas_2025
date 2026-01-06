using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Platform.LicencaService.Filters
{
    public class LicencaTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public LicencaTableFilter()
        {
            Filters = [];
        }
    }
}
