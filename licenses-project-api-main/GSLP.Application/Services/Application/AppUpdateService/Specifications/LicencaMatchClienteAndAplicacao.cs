using Ardalis.Specification;
using GSLP.Domain.Entities.Catalog.Platform;

namespace GSLP.Application.Services.Application.AppUpdateService.Specifications
{
  public class LicencaMatchClienteAndAplicacao : Specification<Licenca>
  {
    public LicencaMatchClienteAndAplicacao(Guid clienteId, Guid aplicacaoId)
    {
      Query.Where(l =>
        l.ClienteId == clienteId
        && l.AplicacaoId == aplicacaoId
        && l.Ativo == true
        && !l.Bloqueada
      );
    }
  }
}


