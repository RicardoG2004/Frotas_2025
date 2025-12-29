using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.Specifications
{
  public class AbastecimentoSearchList : Specification<Abastecimento>
  {
    public AbastecimentoSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.Funcionario);
      _ = Query.Include(x => x.Viatura);

      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => 
          (x.Funcionario != null && x.Funcionario.Nome.Contains(keyword)) ||
          (x.Viatura != null && x.Viatura.Matricula.Contains(keyword))
        );
      }

      _ = Query.OrderByDescending(x => x.Data);
    }
  }
}

