using System;
using Ardalis.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.Specifications;

public class ViaturaWithDetalhesSpecification : Specification<Viatura>
{
  public ViaturaWithDetalhesSpecification(Guid id)
  {
    _ = Query.Where(x => x.Id == id);
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
      .Include(x => x.ViaturaGarantias)
      .ThenInclude(x => x.Garantia);
    _ = Query
      .Include(x => x.ViaturaSeguros)
      .ThenInclude(x => x.Seguro);
    _ = Query.Include(x => x.ViaturaInspecoes);
  }
}

