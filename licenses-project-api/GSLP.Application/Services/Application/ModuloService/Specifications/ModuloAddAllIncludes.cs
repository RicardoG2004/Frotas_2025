using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.ModuloService.Specifications
{
    public class ModuloAddAllIncludes : Specification<Modulo>
    {
        public ModuloAddAllIncludes()
        {
            _ = Query.Include(m => m.Aplicacao);
            _ = Query.Include(m => m.Funcionalidades);
            _ = Query.Include(m => m.LicencasModulos);
        }
    }
}
