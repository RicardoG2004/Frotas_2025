using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ServicoService.Specifications
{
  public class ServicoMatchName : Specification<Servico>
  {
    public ServicoMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}

