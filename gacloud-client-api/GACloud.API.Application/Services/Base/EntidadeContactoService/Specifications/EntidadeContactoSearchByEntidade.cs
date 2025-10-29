using Ardalis.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.Specifications
{
  public class EntidadeContactoSearchByEntidade : Specification<EntidadeContacto>
  {
    public EntidadeContactoSearchByEntidade(Guid entidadeId)
    {
      _ = Query.Where(x => x.EntidadeId == entidadeId);
    }
  }
}
