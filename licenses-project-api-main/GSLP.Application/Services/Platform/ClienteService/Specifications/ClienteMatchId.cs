using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
    public class ClienteMatchId : Specification<Cliente>
    {
        public ClienteMatchId(Guid id)
        {
            _ = Query.Where(c => c.Id == id);
        }
    }
}
