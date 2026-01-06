using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.ModuloService.Specifications
{
    public class ModuloMatchName : Specification<Modulo>
    {
        public ModuloMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(m => m.Nome == name);
            }
            _ = Query.OrderBy(m => m.Nome);
        }
    }
}
