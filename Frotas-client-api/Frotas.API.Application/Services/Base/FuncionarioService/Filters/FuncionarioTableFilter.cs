using Frotas.API.Application.Common.Filter;

namespace Frotas.API.Application.Services.Base.FuncionarioService.Filters
{
    public class FuncionarioTableFilter : PaginationFilter
    {
        public List<TableFilter> Filters { get; set; }

        public FuncionarioTableFilter()
        {
            Filters = [];
        }
    }
}