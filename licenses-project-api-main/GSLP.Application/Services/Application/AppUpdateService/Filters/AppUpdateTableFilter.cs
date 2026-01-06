using GSLP.Application.Common.Filter;

namespace GSLP.Application.Services.Application.AppUpdateService.Filters
{
    public class AppUpdateTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }
        public Guid AplicacaoId { get; set; }
        public string Keyword { get; set; }

        public AppUpdateTableFilter()
        {
            Filters = [];
            Keyword = string.Empty;
        }
    }
}

