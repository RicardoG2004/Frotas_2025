using Ardalis.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.MarcaService.Specifications
{
  public class MarcaSearchList : Specification<Marca>
  {
    public MarcaSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
