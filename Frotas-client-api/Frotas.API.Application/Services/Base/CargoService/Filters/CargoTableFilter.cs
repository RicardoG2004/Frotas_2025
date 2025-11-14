using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.CargoService.Filters
{
    public class CargoTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public CargoTableFilter()
        {
            Filters = [];
        }
    }
}