using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService.Specifications
{
  public class CoveiroMatchName : Specification<Coveiro>
  {
    public CoveiroMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}
