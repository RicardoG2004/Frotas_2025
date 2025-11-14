using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.CargoService.Specifications
{
    public class CargoSearchList : Specification<Cargo>
    {
        public CargoSearchList(string? keyword = "")
        {
            // filters
            if (!string.IsNullOrEmpty(keyword))
            {
                _ = Query.Where(x => x.Designacao.Contains(keyword));
            }
            _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
        }
    }
}