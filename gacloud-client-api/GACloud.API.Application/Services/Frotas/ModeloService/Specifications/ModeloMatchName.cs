using Ardalis.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.ModeloService.Specifications
{
  public class ModeloMatchName : Specification<Modelo>
  {
    public ModeloMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}
