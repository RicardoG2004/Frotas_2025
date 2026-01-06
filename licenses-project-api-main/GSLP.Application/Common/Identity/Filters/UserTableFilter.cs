using GSLP.Application.Common.Filter;

namespace GSLP.Application.Common.Identity.Filters
{
    public class UserTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public UserTableFilter()
        {
            Filters = [];
        }
    }
}
