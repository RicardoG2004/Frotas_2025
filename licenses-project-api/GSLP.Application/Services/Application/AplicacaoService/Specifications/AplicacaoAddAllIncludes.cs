using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.AplicacaoService.Specifications
{
    public class AplicacaoAddAllIncludes : Specification<Aplicacao>
    {
        public AplicacaoAddAllIncludes()
        {
            _ = Query
                .Include(a => a.Modulos)
                .ThenInclude(m => m.Funcionalidades)
                .Include(a => a.Modulos)
                .ThenInclude(m => m.LicencasModulos)
                .Include(a => a.Licencas);
        }
    }
}
