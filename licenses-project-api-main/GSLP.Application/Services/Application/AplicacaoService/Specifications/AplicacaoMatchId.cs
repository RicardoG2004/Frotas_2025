using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.AplicacaoService.Specifications
{
    public class AplicacaoMatchId : Specification<Aplicacao>
    {
        public AplicacaoMatchId(Guid id)
        {
            _ = Query.Where(a => a.Id == id);
        }
    }
}
