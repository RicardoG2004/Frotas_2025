using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.ModuloService.Specifications
{
    public class ModuloSearchList : Specification<Modulo>
    {
        public ModuloSearchList(string? keyword = "", Guid? aplicacaoId = null)
        {
            // filters
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Nome.Contains(keyword));
            }

            // Filter by aplicacaoId if provided
            if (aplicacaoId.HasValue)
            {
                _ = Query.Where(x => x.AplicacaoId == aplicacaoId.Value);
            }

            _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
        }
    }
}
