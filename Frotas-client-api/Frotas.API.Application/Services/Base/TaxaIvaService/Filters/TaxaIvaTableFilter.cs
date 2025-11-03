using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.Filters
{
    public class TaxaIvaTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public TaxaIvaTableFilter()
        {
            Filters = [];
        }
    }
}