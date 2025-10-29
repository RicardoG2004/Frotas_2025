using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.Specifications
{
  public class ProprietarioSearchList : Specification<Proprietario>
  {
    public ProprietarioSearchList(string keyword = "")
    {
      _ = Query.Include(x => x.Entidade).Include(x => x.Cemiterio);

      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x =>
          x.Entidade.Nome.Contains(keyword) || x.Cemiterio.Nome.Contains(keyword)
        );
      }

      _ = Query.OrderBy(x => x.Entidade.Nome);
    }
  }
}

