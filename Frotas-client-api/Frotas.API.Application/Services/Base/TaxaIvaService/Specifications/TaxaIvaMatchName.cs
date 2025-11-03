using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.TaxaIvaService.Specifications
{
    public class TaxaIvaMatchName : Specification<TaxaIva>
    {
        public TaxaIvaMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(h => h.Descricao == name);
            }
            _ = Query.OrderBy(h => h.Descricao);
    }
  }
}