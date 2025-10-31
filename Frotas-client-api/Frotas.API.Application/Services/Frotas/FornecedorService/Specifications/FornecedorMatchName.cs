using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.FornecedorService.Specifications
{
  public class FornecedorMatchName : Specification<Fornecedor>
  {
    public FornecedorMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}

