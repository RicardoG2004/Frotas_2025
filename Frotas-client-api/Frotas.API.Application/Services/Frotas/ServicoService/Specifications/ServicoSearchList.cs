using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ServicoService.Specifications
{
  public class ServicoSearchList : Specification<Servico>
  {
    public ServicoSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.TaxaIva);
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Designacao.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

