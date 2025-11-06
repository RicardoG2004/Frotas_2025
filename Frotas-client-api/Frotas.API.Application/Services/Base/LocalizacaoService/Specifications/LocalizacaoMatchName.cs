using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.LocalizacaoService.Specifications
{
    public class LocalizacaoMatchName : Specification<Localizacao>
    {
        public LocalizacaoMatchName(string? name)
        {
            if (!string.IsNullOrWhiteSpace(name))
            {
                _ = Query.Where(h => h.Designacao == name);
            }
            _ = Query.OrderBy(h => h.Designacao);
        }
    }
}