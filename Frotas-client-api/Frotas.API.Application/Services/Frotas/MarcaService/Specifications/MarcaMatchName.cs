using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.MarcaService.Specifications
{
  public class MarcaMatchName : Specification<Marca>
  {
    public MarcaMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}

