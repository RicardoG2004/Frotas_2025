using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.ModuloService.Specifications
{
    public class ModuloMatchNameAndAplicacaoId : Specification<Modulo>
    {
        public ModuloMatchNameAndAplicacaoId(string? name, Guid aplicacaoId)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(m => m.Nome == name && m.AplicacaoId == aplicacaoId);
            }
            _ = Query.OrderBy(m => m.Nome);
        }
    }
}

