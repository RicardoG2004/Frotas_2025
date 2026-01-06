using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.ModuloService.Specifications
{
    public class ModuloMatchNameAndAplicacaoIdExcludingId : Specification<Modulo>
    {
        public ModuloMatchNameAndAplicacaoIdExcludingId(string? name, Guid aplicacaoId, Guid excludeId)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(m => m.Nome == name && m.AplicacaoId == aplicacaoId && m.Id != excludeId);
            }
            _ = Query.OrderBy(m => m.Nome);
        }
    }
}

