using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaSearchList : Specification<Licenca>
    {
        public LicencaSearchList(string? keyword = "")
        {
            // Include navigation properties needed for DTO mapping
            _ = Query.Include(l => l.Aplicacao).ThenInclude(a => a.Area);
            _ = Query.Include(l => l.Cliente);
            _ = Query.Include(l => l.LicencaAPIKey);

            // filters
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Nome.Contains(keyword));
            }

            _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
        }
    }
}
