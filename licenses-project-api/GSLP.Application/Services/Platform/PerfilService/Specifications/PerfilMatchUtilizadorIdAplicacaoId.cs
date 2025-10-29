using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService.Specifications
{
    public class PerfilMatchUtilizadorIdLicencaId : Specification<Perfil>
    {
        public PerfilMatchUtilizadorIdLicencaId(string utilizadorId, Guid licencaId)
        {
            _ = Query.Include(p => p.Licenca);
            _ = Query.Include(p => p.PerfisFuncionalidades).ThenInclude(pf => pf.Funcionalidade);
            _ = Query.Include(p => p.PerfisUtilizadores);

            // Filter by UtilizadorId and LicencaId
            _ = Query.Where(p =>
                p.PerfisUtilizadores.Any(pu => pu.UtilizadorId == utilizadorId)
                && p.LicencaId == licencaId
            );
        }
    }
}
