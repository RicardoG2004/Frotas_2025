using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeSearchList : Specification<Funcionalidade>
    {
        public FuncionalidadeSearchList(string? keyword = "", Guid? moduloId = null)
        {
            // filters
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Nome.Contains(keyword));
            }

            // Filter by moduloId if provided
            if (moduloId.HasValue)
            {
                _ = Query.Where(x => x.ModuloId == moduloId.Value);
            }

            _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
        }
    }
}
