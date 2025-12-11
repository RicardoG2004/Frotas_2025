using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.Specifications
{
  public class ManutencaoMatchName : Specification<Manutencao>
  {
    public ManutencaoMatchName(Guid viaturaId, DateTime dataEntrada, string horaEntrada)
    {
      Query.Where(x => 
        x.ViaturaId == viaturaId && 
        x.DataEntrada.Date == dataEntrada.Date && 
        x.HoraEntrada == horaEntrada
      );
    }
  }
}

