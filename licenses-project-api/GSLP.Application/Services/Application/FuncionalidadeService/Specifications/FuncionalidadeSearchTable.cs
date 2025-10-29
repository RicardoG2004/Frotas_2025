using Ardalis.Specification;
using GSLP.Application.Common.Filter;
using GSLP.Application.Common.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeSearchTable : Specification<Funcionalidade>
    {
        public FuncionalidadeSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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

                        case "aplicacaoid":
                            if (Guid.TryParse(filter.Value, out Guid aplicacaoId))
                            {
                                _ = Query.Where(x => x.Modulo.AplicacaoId == aplicacaoId);
                            }
                            break;

                        case "moduloid":
                            if (Guid.TryParse(filter.Value, out Guid moduloId))
                            {
                                _ = Query.Where(x => x.ModuloId == moduloId);
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
