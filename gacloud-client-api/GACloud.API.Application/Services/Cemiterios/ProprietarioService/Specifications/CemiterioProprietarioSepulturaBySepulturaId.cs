using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.Specifications
{
  public class ProprietarioSepulturaBySepulturaId
    : Specification<ProprietarioSepultura>
  {
    public ProprietarioSepulturaBySepulturaId(Guid SepulturaId)
    {
      Query.Where(x => x.SepulturaId == SepulturaId);
    }
  }
}

