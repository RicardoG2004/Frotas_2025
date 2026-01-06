using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilFuncionalidadeService.Specifications
{
    public class PerfilFuncionalidadeAddAllIncludes : Specification<PerfilFuncionalidade>
    {
        public PerfilFuncionalidadeAddAllIncludes()
        {
            _ = Query.Include(pf => pf.Funcionalidade);
            _ = Query.Include(pf => pf.Perfil);
        }
    }
}
