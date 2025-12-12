using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.Specifications
{
  public class ManutencaoSearchList : Specification<Manutencao>
  {
    public ManutencaoSearchList(string? keyword = "")
    {
      _ = Query.Include(x => x.Fse);
      _ = Query.Include(x => x.Funcionario);
      _ = Query.Include(x => x.Viatura);
      _ = Query.Include(x => x.ManutencaoServicos)
        .ThenInclude(x => x.Servico);
      _ = Query.Include(x => x.ManutencaoPecas)
        .ThenInclude(x => x.Peca);

      // filters
      if (!string.IsNullOrEmpty(keyword))
      {
        _ = Query.Where(x => 
          (x.Viatura != null && x.Viatura.Matricula.Contains(keyword)) ||
          (x.Fse != null && x.Fse.Nome.Contains(keyword)) ||
          (x.Funcionario != null && x.Funcionario.Nome.Contains(keyword))
        );
      }

      _ = Query.OrderByDescending(x => x.CreatedOn); // default sort order
    }
  }
}

