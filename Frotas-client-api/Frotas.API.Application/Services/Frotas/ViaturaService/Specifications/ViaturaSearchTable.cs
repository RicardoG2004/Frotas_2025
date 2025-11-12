using System.Collections.Generic;
using System.Globalization;
using Ardalis.Specification;
using Frotas.API.Application.Common.Filter;
using Frotas.API.Application.Common.Specification;
using Frotas.API.Domain.Entities.Frotas;
using Microsoft.EntityFrameworkCore;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.Specifications
{
  public class ViaturaSearchTable : Specification<Viatura>
  {
    public ViaturaSearchTable(List<TableFilter> filters, string? dynamicOrder = "")
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
      _ = Query.Include(x => x.Seguro);
      _ = Query
        .Include(x => x.ViaturaEquipamentos)
        .ThenInclude(x => x.Equipamento);

      if (filters != null && filters.Count != 0)
      {
        foreach (TableFilter filter in filters)
        {
          if (string.IsNullOrWhiteSpace(filter.Value))
          {
            continue;
          }

          switch (filter.Id.ToLower(CultureInfo.CurrentCulture))
          {
            case "matricula":
              _ = Query.Where(x => x.Matricula.Contains(filter.Value));
              break;
            case "numero":
              if (int.TryParse(filter.Value, out int numero))
              {
                _ = Query.Where(x => x.Numero == numero);
              }
              break;
            case "marca.designacao":
              _ = Query.Where(x => x.Marca != null && x.Marca.Nome.Contains(filter.Value));
              break;
            case "modelo.designacao":
              _ = Query.Where(x => x.Modelo != null && x.Modelo.Nome.Contains(filter.Value));
              break;
            case "tipoviatura.designacao":
              _ = Query.Where(
                x => x.TipoViatura != null && x.TipoViatura.Designacao.Contains(filter.Value)
              );
              break;
            case "cor.designacao":
              _ = Query.Where(x => x.Cor != null && x.Cor.Designacao.Contains(filter.Value));
              break;
            case "combustivel.designacao":
              _ = Query.Where(
                x => x.Combustivel != null && x.Combustivel.Nome.Contains(filter.Value)
              );
              break;
            case "categoria.designacao":
              _ = Query.Where(
                x => x.Categoria != null && x.Categoria.Designacao.Contains(filter.Value)
              );
              break;
            case "localizacao.designacao":
              _ = Query.Where(
                x => x.Localizacao != null && x.Localizacao.Designacao.Contains(filter.Value)
              );
              break;
            case "setor.descricao":
              _ = Query.Where(x => x.Setor != null && x.Setor.Descricao.Contains(filter.Value));
              break;
            case "delegacao.designacao":
              _ = Query.Where(
                x => x.Delegacao != null && x.Delegacao.Designacao.Contains(filter.Value)
              );
              break;
            case "terceiro.nome":
              _ = Query.Where(x => x.Terceiro != null && x.Terceiro.Nome.Contains(filter.Value));
              break;
            case "fornecedor.nome":
              _ = Query.Where(
                x => x.Fornecedor != null && x.Fornecedor.Nome.Contains(filter.Value)
              );
              break;
            case "seguro.designacao":
              _ = Query.Where(x => x.Seguro != null && x.Seguro.Designacao.Contains(filter.Value));
              break;
            case "marketing":
              if (bool.TryParse(filter.Value, out bool marketing))
              {
                _ = Query.Where(x => x.Marketing == marketing);
              }
              break;
            case "mercadorias":
              if (bool.TryParse(filter.Value, out bool mercadorias))
              {
                _ = Query.Where(x => x.Mercadorias == mercadorias);
              }
              break;
            default:
              break;
          }
        }
      }

      if (string.IsNullOrEmpty(dynamicOrder))
      {
        _ = Query.OrderByDescending(x => x.CreatedOn);
      }
      else
      {
        _ = Query.OrderBy(dynamicOrder);
      }
    }
  }
}

