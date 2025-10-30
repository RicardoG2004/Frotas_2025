using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeContactoService.Specifications
{
  public class EntidadeContactoSearchByEntidade : Specification<EntidadeContacto>
  {
    public EntidadeContactoSearchByEntidade(Guid entidadeId)
    {
      _ = Query.Where(x => x.EntidadeId == entidadeId);
    }
  }
}
