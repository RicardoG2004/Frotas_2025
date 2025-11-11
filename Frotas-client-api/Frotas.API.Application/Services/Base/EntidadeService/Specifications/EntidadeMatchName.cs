using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.EntidadeService.Specifications
{
  public class EntidadeMatchName : Specification<Entidade>
  {
    public EntidadeMatchName(string designacao)
    {
      Query.Where(x => x.Designacao == designacao);
    }
  }
}