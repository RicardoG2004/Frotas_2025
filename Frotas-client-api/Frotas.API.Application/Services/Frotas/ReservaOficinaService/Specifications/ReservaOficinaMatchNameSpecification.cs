using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.Specifications
{
  // Simple name/matricula/causa matcher for quick lookups
  public class ReservaOficinaMatchNameSpecification : Specification<ReservaOficina>
  {
    public ReservaOficinaMatchNameSpecification(string keyword)
    {
      if (string.IsNullOrWhiteSpace(keyword))
      {
        return;
      }

      _ = Query.Where(x =>
        (x.Funcionario != null && x.Funcionario.Nome.Contains(keyword)) ||
        (x.Viatura != null && x.Viatura.Matricula.Contains(keyword)) ||
        (x.Causa != null && x.Causa.Contains(keyword)) ||
        (x.Observacoes != null && x.Observacoes.Contains(keyword))
      );
    }
  }
}

