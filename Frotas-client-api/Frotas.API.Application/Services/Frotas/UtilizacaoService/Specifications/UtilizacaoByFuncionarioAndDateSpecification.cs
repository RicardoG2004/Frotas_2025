using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.UtilizacaoService.Specifications
{
  public class UtilizacaoByFuncionarioAndDateSpecification : Specification<Utilizacao>
  {
    public UtilizacaoByFuncionarioAndDateSpecification(Guid funcionarioId, DateTime dataUtilizacao)
    {
      _ = Query.Include(x => x.Funcionario);
      Query.Where(x =>
        x.FuncionarioId == funcionarioId &&
        x.DataUtilizacao.Date == dataUtilizacao.Date
      );
    }
  }

  public class UtilizacaoByFuncionarioSpecification : Specification<Utilizacao>
  {
    public UtilizacaoByFuncionarioSpecification(Guid funcionarioId)
    {
      _ = Query.Include(x => x.Funcionario);
      Query.Where(x => x.FuncionarioId == funcionarioId);
      Query.OrderByDescending(x => x.DataUtilizacao);
    }
  }
}

