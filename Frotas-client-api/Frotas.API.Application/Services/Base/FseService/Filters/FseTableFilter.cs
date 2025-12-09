using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.FseService.Filters
{
    public class FseTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public FseTableFilter()
        {
            Filters = [];
        }
    }
}