using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaMatchAPIKey : Specification<Licenca>
    {
        public LicencaMatchAPIKey(string APIKey)
        {
            // Join Licenca with LicencaAPIKey and filter by APIkey
            _ = Query
                .Where(l => l.LicencaAPIKey.APIKey == APIKey)
                .Include(l => l.LicencasModulos) // Include associated LicencaModulos
                .ThenInclude(lm => lm.Modulo) // Include the Modulo through LicencaModulo relationship
                .Include(l => l.LicencasFuncionalidades) // Include associated LicencaFuncionalidade
                .ThenInclude(lm => lm.Funcionalidade); // Include the Funcionalidade through LicencaFuncionalidade relationship
        }
    }
}
