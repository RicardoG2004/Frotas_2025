using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ModeloService.Specifications
{
  public class ModeloMatchName : Specification<Modelo>
  {
    public ModeloMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}
