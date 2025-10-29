using System;
using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService.Specifications
{
  public class TalhaoMatchNameAndZonaId : Specification<Talhao>
  {
    public TalhaoMatchNameAndZonaId(string? nome, string? ZonaId)
    {
      if (!string.IsNullOrWhiteSpace(nome) && !string.IsNullOrWhiteSpace(ZonaId))
      {
        var guidZonaId = Guid.Parse(ZonaId);
        _ = Query.Where(h => h.Nome == nome && h.ZonaId == guidZonaId);
      }
      else if (!string.IsNullOrWhiteSpace(nome))
      {
        _ = Query.Where(h => h.Nome == nome);
      }
      else if (!string.IsNullOrWhiteSpace(ZonaId))
      {
        var guidZonaId = Guid.Parse(ZonaId);
        _ = Query.Where(h => h.ZonaId == guidZonaId);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}

