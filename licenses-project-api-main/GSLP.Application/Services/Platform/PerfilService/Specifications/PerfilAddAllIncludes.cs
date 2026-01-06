using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService.Specifications
{
    public class PerfilAddAllIncludes : Specification<Perfil>
    {
        public PerfilAddAllIncludes()
        {
            _ = Query.Include(p => p.Licenca);
            _ = Query.Include(p => p.PerfisFuncionalidades).ThenInclude(pf => pf.Funcionalidade);
            _ = Query.Include(p => p.PerfisUtilizadores);
        }
    }
}
