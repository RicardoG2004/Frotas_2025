using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Platform.ClienteService.Filters
{
    public class ClienteTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public ClienteTableFilter()
        {
            Filters = [];
        }
    }
}
