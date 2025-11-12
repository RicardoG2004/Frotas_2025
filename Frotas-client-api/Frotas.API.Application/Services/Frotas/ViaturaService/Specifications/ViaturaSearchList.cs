using System.Linq;
using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.Specifications
{
  public class ViaturaSearchList : Specification<Viatura>
  {
    public ViaturaSearchList(string? keyword = "")
    {
      // includes
      _ = Query.Include(x => x.Marca);
      _ = Query.Include(x => x.Modelo);
      _ = Query.Include(x => x.TipoViatura);
      _ = Query.Include(x => x.Cor);
      _ = Query.Include(x => x.Combustivel);
      _ = Query.Include(x => x.Conservatoria);
      _ = Query.Include(x => x.Categoria);
      _ = Query.Include(x => x.Localizacao);
      _ = Query.Include(x => x.Setor);
      _ = Query.Include(x => x.Delegacao);
      _ = Query.Include(x => x.Terceiro);
      _ = Query.Include(x => x.Fornecedor);
      _ = Query
        .Include(x => x.ViaturaEquipamentos)
        .ThenInclude(x => x.Equipamento);
      _ = Query
        .Include(x => x.ViaturaSeguros)
        .ThenInclude(x => x.Seguro);

      if (!string.IsNullOrWhiteSpace(keyword))
      {
        string term = keyword.Trim();
        _ = Query.Where(
          x =>
            x.Matricula.Contains(term)
            || (x.Marca != null && x.Marca.Nome.Contains(term))
            || (x.Modelo != null && x.Modelo.Nome.Contains(term))
            || (x.TipoViatura != null && x.TipoViatura.Designacao.Contains(term))
        );
      }

      _ = Query.OrderByDescending(x => x.CreatedOn);
    }
  }
}

