using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.PerfilService.Specifications
{
    public class PerfilMatchName : Specification<Perfil>
    {
        public PerfilMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(p => p.Nome == name);
            }
            _ = Query.OrderBy(p => p.Nome);
        }
    }
}
