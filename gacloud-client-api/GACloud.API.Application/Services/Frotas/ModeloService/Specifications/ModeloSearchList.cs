using Ardalis.Specification;
using GACloud.API.Domain.Entities.Frotas;

namespace GACloud.API.Application.Services.Frotas.ModeloService.Specifications
{
  public class ModeloSearchList : Specification<Modelo>
  {
    public ModeloSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.Marca);
      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword) || x.Marca.Nome.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
