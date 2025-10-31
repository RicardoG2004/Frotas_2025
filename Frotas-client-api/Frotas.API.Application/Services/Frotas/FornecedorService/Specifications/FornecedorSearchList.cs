using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.FornecedorService.Specifications
{
  public class FornecedorSearchList : Specification<Fornecedor>
  {
    public FornecedorSearchList(string? keyword = "")
    {
      // includes
      _ = Query.Include(x => x.CodigoPostalEscritorio);
      _ = Query.Include(x => x.PaisEscritorio);
      _ = Query.Include(x => x.CodigoPostalCarga);
      _ = Query.Include(x => x.PaisCarga);

      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword) || x.NumContribuinte.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

