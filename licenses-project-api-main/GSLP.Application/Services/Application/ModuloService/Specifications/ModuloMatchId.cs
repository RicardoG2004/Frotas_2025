using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.ModuloService.Specifications
{
    public class ModuloMatchId : Specification<Modulo>
    {
        public ModuloMatchId(Guid id)
        {
            _ = Query.Where(m => m.Id == id);
        }
    }
}
