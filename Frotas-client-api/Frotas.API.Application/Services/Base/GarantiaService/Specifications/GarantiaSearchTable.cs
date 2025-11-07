using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.GarantiaService.Specifications
{
    public class GarantiaSearchTable : Specification<Garantia>
    {
        public GarantiaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
        {
            // filters
            if (filters != null && filters.Count != 0)
            {
                foreach (TableFilter filter in filters)
                {
                    switch (filter.Id.ToLower(System.Globalization.CultureInfo.CurrentCulture))
                    {
                        case "designacao":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Designacao.Contains(filter.Value));
                            }
                            break;
                        case "anos":
                            if (int.TryParse(filter.Value, out int anos))
                            {
                                _ = Query.Where(x => x.Anos == anos);
                            }
                            break;
                        case "kms":
                            if (int.TryParse(filter.Value, out int kms))
                            {
                                _ = Query.Where(x => x.Kms == kms);
                            }
                            break;
                        default:
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