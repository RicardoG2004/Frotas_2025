using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeMatchAplicacaoId : Specification<Funcionalidade>
    {
        public FuncionalidadeMatchAplicacaoId(Guid aplicacaoId)
        {
            _ = Query.Where(f => f.Modulo.AplicacaoId == aplicacaoId);
        }
    }
}
