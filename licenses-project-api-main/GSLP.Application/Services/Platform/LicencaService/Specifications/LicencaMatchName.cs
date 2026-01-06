using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaMatchName : Specification<Licenca>
    {
        public LicencaMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(l => l.Nome == name);
            }
            _ = Query.OrderBy(l => l.Nome);
        }
    }
}
