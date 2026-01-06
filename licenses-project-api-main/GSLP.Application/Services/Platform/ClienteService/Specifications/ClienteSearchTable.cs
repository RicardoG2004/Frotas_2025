using Ardalis.Specification;
using GSLP.Application.Common.Filter;
using GSLP.Application.Common.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
    public class ClienteSearchTable : Specification<Cliente>
    {
        public ClienteSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
        {
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

                        case "nif":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.NIF.Contains(filter.Value));
                            }
                            break;

                        case "ativo":
                            if (bool.TryParse(filter.Value, out bool ativo))
                            {
                                _ = Query.Where(x => x.Ativo == ativo);
                            }
                            break;

                        case "sigla":
                            if (Guid.TryParse(filter.Value, out Guid areaId))
                            {
                                _ = Query.Where(x => x.Sigla.Contains(filter.Value));
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
                _ = Query.OrderBy(dynamicOrder); // dynamic (JQDT) sort order
            }
        }
    }
}
