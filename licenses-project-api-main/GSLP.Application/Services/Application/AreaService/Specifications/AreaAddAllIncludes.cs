using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Application;

namespace GSLP.Application.Services.Application.AreaService.Specifications
{
    public class AreaAddAllIncludes : Specification<Area>
    {
        public AreaAddAllIncludes()
        {
            _ = Query.Include(a => a.Aplicacoes);
        }
    }
}
