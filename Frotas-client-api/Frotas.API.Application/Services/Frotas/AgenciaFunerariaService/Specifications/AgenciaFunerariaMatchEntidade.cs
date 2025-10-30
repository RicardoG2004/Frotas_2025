using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.Specifications
{
  public class AgenciaFunerariaMatchEntidade : Specification<AgenciaFuneraria>
  {
    public AgenciaFunerariaMatchEntidade(Guid entidadeId)
    {
      Query.Where(x => x.EntidadeId == entidadeId);
    }
  }
}

