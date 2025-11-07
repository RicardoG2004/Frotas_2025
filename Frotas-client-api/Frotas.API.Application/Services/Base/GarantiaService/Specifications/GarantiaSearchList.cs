using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.GarantiaService.Specifications
{
    public class GarantiaSearchList : Specification<Garantia>
    {
        public GarantiaSearchList(string? keyword = "")
        {
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Designacao.Contains(keyword));
            }
            _ = Query.OrderByDescending(x => x.CreatedOn);
        }
    }
}