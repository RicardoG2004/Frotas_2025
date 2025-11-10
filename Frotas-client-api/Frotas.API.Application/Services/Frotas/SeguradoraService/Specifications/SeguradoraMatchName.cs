using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService.Specifications
{
  public class SeguradoraMatchName : Specification<Seguradora>
  {
    public SeguradoraMatchName(string descricao)
    {
      Query.Where(x => x.Descricao == descricao);
    }
  }
}