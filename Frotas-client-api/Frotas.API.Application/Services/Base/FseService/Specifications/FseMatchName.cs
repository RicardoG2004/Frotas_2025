using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FseService.Specifications
{
    public class FseMatchName : Specification<Fse>
    {
        public FseMatchName(string nome)
        {
            Query.Where(x => x.Nome == nome);
        }
    }
}