using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService.Specifications
{
    public class PerfilSearchListMatchLicencaId : Specification<Perfil>
    {
        public PerfilSearchListMatchLicencaId(Guid? licencaId, string? keyword = "")
        {
            // filters
            if (licencaId != Guid.Empty)
            {
                // Add the where condition to filter by LicencaId
                _ = Query.Where(p => p.LicencaId == licencaId);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Nome.Contains(keyword));
            }

            _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
        }
    }
}
