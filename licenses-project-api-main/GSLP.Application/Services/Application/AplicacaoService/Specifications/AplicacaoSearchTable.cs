using Ardalis.Specification;
using GSLP.Application.Common.Filter;
using GSLP.Application.Common.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.AplicacaoService.Specifications
{
    public class AplicacaoSearchTable : Specification<Aplicacao>
    {
        public AplicacaoSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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

                        case "descricao":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Descricao.Contains(filter.Value));
                            }
                            break;

                        case "ativo":
                            if (bool.TryParse(filter.Value, out bool ativo))
                            {
                                _ = Query.Where(x => x.Ativo == ativo);
                            }
                            break;

                        case "areaid":
                            if (Guid.TryParse(filter.Value, out Guid areaId))
                            {
                                _ = Query.Where(x => x.AreaId == areaId);
                            }
                            break;
                    }
                }
            }

            // sort order
            if (string.IsNullOrEmpty(dynamicOrder))
            {
                _ = Query.OrderByDescending(x => x.CreatedOn);
            }
            else
            {
                _ = Query.OrderBy(dynamicOrder);
            }
        }
    }
}
