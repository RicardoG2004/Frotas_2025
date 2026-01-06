using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Platform.ClienteService.Specifications
{
  public class LicencasByAplicacaoId : Specification<Licenca>
  {
    public LicencasByAplicacaoId(Guid aplicacaoId)
    {
      Query.Where(l => l.AplicacaoId == aplicacaoId && l.Ativo == true && !l.Bloqueada);
    }
  }
}

