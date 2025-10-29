using Ardalis.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.CoveiroService.Specifications
{
  public class CoveiroMatchName : Specification<Coveiro>
  {
    public CoveiroMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}
