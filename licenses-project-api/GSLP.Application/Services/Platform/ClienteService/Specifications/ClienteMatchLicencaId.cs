using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
    public class ClienteMatchLicencaId : Specification<Cliente>
    {
        public ClienteMatchLicencaId(Guid licencaId)
        {
            // Ensure the query filters cliente by the associated licenca
            _ = Query.Where(cliente => cliente.Licencas.Any(l => l.Id == licencaId)); // Assuming Licenca has an Id property
        }
    }
}
