using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilUtilizadorService.Specifications
{
    public class PerfilUtilizadorAddAllIncludes : Specification<PerfilUtilizador>
    {
        public PerfilUtilizadorAddAllIncludes()
        {
            _ = Query.Include(pu => pu.Perfil);
            _ = Query.Include(pu => pu.Utilizador);
        }
    }
}
