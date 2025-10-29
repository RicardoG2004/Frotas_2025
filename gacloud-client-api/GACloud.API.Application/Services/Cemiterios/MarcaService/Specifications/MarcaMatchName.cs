using Ardalis.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.MarcaService.Specifications
{
  public class MarcaMatchName : Specification<Marca>
  {
    public MarcaMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}

