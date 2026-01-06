using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
    public class ClienteMatchNIF : Specification<Cliente>
    {
        public ClienteMatchNIF(string? nif)
        {
            if (!string.IsNullOrWhiteSpace(nif))
            {
                _ = Query.Where(c => c.NIF == nif);
            }
            _ = Query.OrderBy(c => c.NIF);
        }
    }
}
