using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService.Specifications
{
  public class EquipamentoMatchName : Specification<Equipamento>
  {
    public EquipamentoMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}

