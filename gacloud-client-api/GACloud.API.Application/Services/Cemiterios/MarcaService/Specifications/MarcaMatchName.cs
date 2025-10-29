using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.MarcaService.Specifications
{
  public class MarcaMatchName : Specification<Marca>
  {
    public MarcaMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}

