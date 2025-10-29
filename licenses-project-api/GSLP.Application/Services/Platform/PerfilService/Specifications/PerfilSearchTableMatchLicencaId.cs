using Ardalis.Specification;
using GSLP.Application.Common.Filter;
using GSLP.Application.Common.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService.Specifications
{
    public class PerfilSearchTableMatchLicencaId : Specification<Perfil>
    {
        public PerfilSearchTableMatchLicencaId(
            List<TableFilter> filters,
            string? dynamicOrder = "",
            Guid? licencaId = null
        )
        {
            // First apply the LicencaId filter if provided
            if (licencaId.HasValue && licencaId != Guid.Empty)
            {
                _ = Query.Where(x => x.LicencaId == licencaId);
            }

            // Apply filters
            if (filters != null && filters.Any())
            {
                foreach (var filter in filters)
                {
                    switch (filter.Id.ToLower())
                    {
                        case "nome":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Nome.Contains(filter.Value));
                            }
                            break;

                        case "ativo":
                            if (bool.TryParse(filter.Value, out bool ativo))
                            {
                                _ = Query.Where(x => x.Ativo == ativo);
                            }
                            break;
                    }
                }
            }

            // sort order
            if (string.IsNullOrEmpty(dynamicOrder))
            {
                _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
            }
            else
            {
                // Use the extension method from ArdalisSpecificationExtensions
                _ = Query.OrderBy(dynamicOrder); // dynamic sort order
            }
        }
    }
}
