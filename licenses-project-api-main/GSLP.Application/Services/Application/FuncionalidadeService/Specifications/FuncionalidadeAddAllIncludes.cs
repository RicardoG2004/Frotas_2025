using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeAddAllIncludes : Specification<Funcionalidade>
    {
        public FuncionalidadeAddAllIncludes()
        {
            _ = Query.Include(f => f.Modulo);
        }
    }
}
