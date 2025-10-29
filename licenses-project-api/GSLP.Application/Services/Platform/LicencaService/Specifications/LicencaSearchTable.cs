using Ardalis.Specification;
using GSLP.Application.Common.Filter;
using GSLP.Application.Common.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.LicencaService.Specifications
{
    public class LicencaSearchTable : Specification<Licenca>
    {
        public LicencaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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

                        case "datainicio":
                            if (DateTime.TryParse(filter.Value, out DateTime dataInicio))
                            {
                                _ = Query.Where(x => x.DataInicio >= dataInicio);
                            }
                            break;

                        case "datafim":
                            if (DateTime.TryParse(filter.Value, out DateTime dataFim))
                            {
                                _ = Query.Where(x => x.DataFim <= dataFim);
                            }
                            break;

                        case "aplicacaoid":
                            if (Guid.TryParse(filter.Value, out Guid aplicacaoId))
                            {
                                _ = Query.Where(x => x.AplicacaoId == aplicacaoId);
                            }
                            break;

                        case "aplicacao.nome":
                            if (!string.IsNullOrWhiteSpace(filter.Value))
                            {
                                _ = Query.Where(x => x.Aplicacao.Nome.Contains(filter.Value));
                            }
                            break;

                        case "clienteid":
                            if (Guid.TryParse(filter.Value, out Guid clienteId))
                            {
                                _ = Query.Where(x => x.ClienteId == clienteId);
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
                _ = Query.OrderBy(dynamicOrder); // dynamic (JQDT) sort order
            }
        }
    }
}
