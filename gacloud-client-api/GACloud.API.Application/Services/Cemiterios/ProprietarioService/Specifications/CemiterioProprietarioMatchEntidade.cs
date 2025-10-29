using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.Specifications
{
  public class ProprietarioMatchEntidade : Specification<Proprietario>
  {
    public ProprietarioMatchEntidade(Guid entidadeId)
    {
      Query.Where(x => x.EntidadeId == entidadeId);
    }
  }
}

