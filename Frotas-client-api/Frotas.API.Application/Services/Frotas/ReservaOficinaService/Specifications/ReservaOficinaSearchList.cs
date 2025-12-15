using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.Specifications
{
  public class ReservaOficinaSearchList : Specification<ReservaOficina>
  {
    public ReservaOficinaSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.Funcionario);
      _ = Query.Include(x => x.Viatura);

      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => 
          (x.Funcionario != null && x.Funcionario.Nome.Contains(keyword)) ||
          (x.Viatura != null && x.Viatura.Matricula.Contains(keyword)) ||
          (x.Causa != null && x.Causa.Contains(keyword)) ||
          (x.Observacoes != null && x.Observacoes.Contains(keyword))
        );
      }

      _ = Query.OrderByDescending(x => x.DataReserva);
    }
  }
}
