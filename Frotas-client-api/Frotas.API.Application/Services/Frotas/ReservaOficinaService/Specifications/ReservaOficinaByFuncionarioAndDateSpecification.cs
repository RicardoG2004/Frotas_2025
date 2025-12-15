using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.Specifications
{
  public class ReservaOficinaByFuncionarioAndDateSpecification : Specification<ReservaOficina>
  {
    public ReservaOficinaByFuncionarioAndDateSpecification(Guid funcionarioId, DateTime dataReserva)
    {
      _ = Query.Include(x => x.Funcionario);
      Query.Where(x =>
        x.FuncionarioId == funcionarioId &&
        x.DataReserva.Date == dataReserva.Date
      );
    }
  }

  public class ReservaOficinaByFuncionarioSpecification : Specification<ReservaOficina>
  {
    public ReservaOficinaByFuncionarioSpecification(Guid funcionarioId)
    {
      _ = Query.Include(x => x.Funcionario);
      Query.Where(x => x.FuncionarioId == funcionarioId);
      Query.OrderByDescending(x => x.DataReserva);
    }
  }
}
