using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.Specifications
{
  public class ManutencaoServicoByManutencaoIdSpecification : Specification<ManutencaoServico>
  {
    public ManutencaoServicoByManutencaoIdSpecification(Guid manutencaoId)
    {
      Query.Where(x => x.ManutencaoId == manutencaoId);
    }
  }
}
