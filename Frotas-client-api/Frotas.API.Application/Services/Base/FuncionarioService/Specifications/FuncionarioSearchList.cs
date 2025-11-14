using Ardalis.Specification;
using Frotas.API.Domain.Entities.Base;

namespace Frotas.API.Application.Services.Base.FuncionarioService.Specifications
{
  public class FuncionarioSearchList : Specification<Funcionario>
  {
    public FuncionarioSearchList(string? keyword = "")
    {
      // includes
      _ = Query.Include(x => x.CodigoPostal);
      _ = Query.Include(x => x.Freguesia);
      _ = Query.Include(x => x.Cargo);
      _ = Query.Include(x => x.Delegacao);

      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword) || x.Email.Contains(keyword) || x.Telefone.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}


