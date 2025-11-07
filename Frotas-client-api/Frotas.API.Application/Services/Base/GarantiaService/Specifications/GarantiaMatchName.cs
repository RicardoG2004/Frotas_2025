using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.GarantiaService.Specifications
{
    public class GarantiaMatchName : Specification<Garantia>
    {
        public GarantiaMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(h => h.Designacao == name);
            }
            _ = Query.OrderBy(h => h.Designacao);
        }
    }
}