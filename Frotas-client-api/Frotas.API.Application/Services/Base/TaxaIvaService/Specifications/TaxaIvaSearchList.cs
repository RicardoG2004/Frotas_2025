using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.Specifications
{
    public class TaxaIvaSearchList : Specification<TaxaIva>
    {
        public TaxaIvaSearchList(string? keyword = "")
        {
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Descricao.Contains(keyword));
            }
            _ = Query.OrderByDescending(x => x.CreatedOn);
        }
    }
}