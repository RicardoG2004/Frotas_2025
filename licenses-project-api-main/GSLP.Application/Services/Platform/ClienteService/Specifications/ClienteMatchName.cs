using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
    public class ClienteMatchName : Specification<Cliente>
    {
        public ClienteMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(c => c.Nome == name);
            }
            _ = Query.OrderBy(c => c.Nome);
        }
    }
}
