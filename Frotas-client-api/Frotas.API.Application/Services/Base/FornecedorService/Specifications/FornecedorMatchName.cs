using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FornecedorService.Specifications
{
  public class FornecedorMatchName : Specification<Fornecedor>
  {
    public FornecedorMatchName(string nome)
    {
      Query.Where(x => x.Nome == nome);
    }
  }
}


