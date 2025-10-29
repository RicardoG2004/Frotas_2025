using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.Specifications
{
  public class ProprietarioSepulturaByProprietarioId
    : Specification<ProprietarioSepultura>
  {
    public ProprietarioSepulturaByProprietarioId(Guid ProprietarioId)
    {
      _ = Query
        .Include(x => x.Sepultura)
        .Where(x => x.ProprietarioId == ProprietarioId)
        .OrderBy(x => x.Sepultura.Nome);
    }
  }
}

