using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.CargoService.Specifications
{
    public class CargoMatchName : Specification<Cargo>
    {
        public CargoMatchName(string designacao)
        {
            Query.Where(x => x.Designacao == designacao);
        }
    }
}