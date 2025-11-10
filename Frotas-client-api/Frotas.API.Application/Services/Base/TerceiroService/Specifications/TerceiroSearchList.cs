using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.TerceiroService.Specifications
{
    public class TerceiroSearchList : Specification<Terceiro>
    {
        public TerceiroSearchList(string? keyword = "")
        {
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                _ = Query.Where(x => x.Nome.Contains(keyword));
            }
            _ = Query.OrderByDescending(x => x.CreatedOn);
        }
    }
}