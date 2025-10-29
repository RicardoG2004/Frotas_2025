using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService.Specifications
{
    public class PerfilMatchLicencaId : Specification<Perfil>
    {
        public PerfilMatchLicencaId(Guid licencaId)
        {
            if (licencaId != Guid.Empty)
            {
                // Add the where condition to filter by LicencaId
                _ = Query.Where(p => p.LicencaId == licencaId);
            }

            // Optionally, add an order to the query (this part is optional depending on your requirements)
            _ = Query.OrderBy(p => p.CreatedBy); // You can adjust this to order by another field if needed
        }
    }
}
