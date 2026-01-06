using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeMatchModuloId : Specification<Funcionalidade>
    {
        public FuncionalidadeMatchModuloId(Guid moduloId)
        {
            _ = Query.Where(f => f.ModuloId == moduloId);
        }
    }
}
