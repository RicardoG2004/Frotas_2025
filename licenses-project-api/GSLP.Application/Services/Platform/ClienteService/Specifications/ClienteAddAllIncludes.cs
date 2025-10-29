using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
    public class ClienteAddAllIncludes : Specification<Cliente>
    {
        public ClienteAddAllIncludes()
        {
            _ = Query.Include(c => c.Utilizadores);
            _ = Query.Include(c => c.Licencas);
        }
    }
}
