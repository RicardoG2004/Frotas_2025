using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.Specifications
{
  public class AgenciaFunerariaMatchEntidade : Specification<AgenciaFuneraria>
  {
    public AgenciaFunerariaMatchEntidade(Guid entidadeId)
    {
      Query.Where(x => x.EntidadeId == entidadeId);
    }
  }
}

