using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.Specifications
{
  public class ProprietarioSepulturaBySepulturaId
    : Specification<ProprietarioSepultura>
  {
    public ProprietarioSepulturaBySepulturaId(Guid SepulturaId)
    {
      _ = Query
        .Include(x => x.Proprietario)
        .ThenInclude(x => x.Entidade)
        .Where(x => x.SepulturaId == SepulturaId)
        .OrderBy(x => x.Proprietario.Entidade.Nome);
    }
  }
}

