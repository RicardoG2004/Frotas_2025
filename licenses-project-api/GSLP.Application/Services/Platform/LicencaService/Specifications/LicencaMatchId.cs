using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaMatchId : Specification<Licenca>
    {
        public LicencaMatchId(Guid id)
        {
            _ = Query.Where(l => l.Id == id);
        }
    }
}
