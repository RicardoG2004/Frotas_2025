using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaAddAllIncludes : Specification<Licenca>
    {
        public LicencaAddAllIncludes()
        {
            _ = Query.Include(l => l.Aplicacao);
            _ = Query.Include(l => l.Cliente);
            _ = Query.Include(l => l.LicencasModulos).ThenInclude(lm => lm.Modulo);
            _ = Query.Include(l => l.LicencasFuncionalidades).ThenInclude(lf => lf.Funcionalidade);
            _ = Query.Include(l => l.LicencasUtilizadores).ThenInclude(lu => lu.Utilizador);
            _ = Query.Include(l => l.LicencaAPIKey);
        }
    }
}
