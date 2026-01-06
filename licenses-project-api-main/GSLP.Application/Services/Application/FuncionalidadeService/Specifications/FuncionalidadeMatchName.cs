using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.FuncionalidadeService.Specifications
{
    public class FuncionalidadeMatchName : Specification<Funcionalidade>
    {
        public FuncionalidadeMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(f => f.Nome == name);
            }
            _ = Query.OrderBy(f => f.Nome);
        }
    }
}
