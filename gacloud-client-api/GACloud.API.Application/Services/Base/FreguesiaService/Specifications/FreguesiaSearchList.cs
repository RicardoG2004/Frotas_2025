using Ardalis.Specification;
using GACloud.API.Domain.Entities.Base;

namespace GACloud.API.Application.Services.Base.FreguesiaService.Specifications
{
  public class FreguesiaSearchList : Specification<Freguesia>
  {
    public FreguesiaSearchList(string? keyword = "")
    {
      // filters
      if (!string.IsNullOrWhiteSpace(keyword))
      {
        _ = Query.Where(x => x.Nome.Contains(keyword));
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}
