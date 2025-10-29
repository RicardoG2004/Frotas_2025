using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Platform.PerfilService.Filters
{
    public class PerfilTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public PerfilTableFilter()
        {
            Filters = [];
        }
    }
}
