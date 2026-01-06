using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.Specifications
{
  public class AbastecimentoByFuncionarioSpecification : Specification<Abastecimento>
  {
    public AbastecimentoByFuncionarioSpecification(Guid funcionarioId)
    {
      _ = Query.Include(x => x.Funcionario);
      _ = Query.Include(x => x.Viatura);
      _ = Query.Include(x => x.Combustivel);
      Query.Where(x => x.FuncionarioId == funcionarioId);
      Query.OrderByDescending(x => x.Data);
    }
  }
}

