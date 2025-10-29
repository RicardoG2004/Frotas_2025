using Ardalis.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.AgenciaFunerariaService.Specifications
{
  public class AgenciaFunerariaMatchEntidade : Specification<AgenciaFuneraria>
  {
    public AgenciaFunerariaMatchEntidade(Guid entidadeId)
    {
      Query.Where(x => x.EntidadeId == entidadeId);
    }
  }
}

