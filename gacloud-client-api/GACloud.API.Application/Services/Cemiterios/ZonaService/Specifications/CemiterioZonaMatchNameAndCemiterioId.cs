using System;
using Ardalis.Specification;
using GACloud.API.Domain.Entities.Cemiterios;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService.Specifications
{
  public class ZonaMatchNameAndCemiterioId : Specification<Zona>
  {
    public ZonaMatchNameAndCemiterioId(string? nome, string? cemiterioId)
    {
      if (!string.IsNullOrWhiteSpace(nome) && !string.IsNullOrWhiteSpace(cemiterioId))
      {
        var guidCemiterioId = Guid.Parse(cemiterioId);
        _ = Query.Where(h => h.Nome == nome && h.CemiterioId == guidCemiterioId);
      }
      else if (!string.IsNullOrWhiteSpace(nome))
      {
        _ = Query.Where(h => h.Nome == nome);
      }
      else if (!string.IsNullOrWhiteSpace(cemiterioId))
      {
        var guidCemiterioId = Guid.Parse(cemiterioId);
        _ = Query.Where(h => h.CemiterioId == guidCemiterioId);
      }
      _ = Query.OrderBy(h => h.Nome);
    }
  }
}

