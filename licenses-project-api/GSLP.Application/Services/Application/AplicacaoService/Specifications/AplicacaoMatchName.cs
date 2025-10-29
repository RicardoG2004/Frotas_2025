using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.AplicacaoService.Specifications
{
    public class AplicacaoMatchName : Specification<Aplicacao>
    {
        public AplicacaoMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(a => a.Nome == name);
            }
            _ = Query.OrderBy(a => a.Nome);
        }
    }
}
