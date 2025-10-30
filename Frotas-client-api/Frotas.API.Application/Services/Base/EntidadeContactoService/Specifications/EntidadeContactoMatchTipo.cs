using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeContactoService.Specifications
{
  public class EntidadeContactoMatchTipo : Specification<EntidadeContacto>
  {
    public EntidadeContactoMatchTipo(Guid entidadeId, int entidadeContactoTipoId)
    {
      _ = Query.Where(x =>
        x.EntidadeId == entidadeId && x.EntidadeContactoTipoId == entidadeContactoTipoId
      );
    }
  }
}
