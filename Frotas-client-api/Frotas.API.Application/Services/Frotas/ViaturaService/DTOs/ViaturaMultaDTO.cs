using System;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;

public class ViaturaMultaDTO : IDto
{
  public Guid Id { get; set; }
  public Guid FuncionarioId { get; set; }
  public DateTime DataHora { get; set; }
  public string? Hora { get; set; }
  public string Local { get; set; }
  public string Motivo { get; set; }
  public decimal Valor { get; set; }
}

public class ViaturaMultaUpsertDTO : IDto
{
  public Guid? Id { get; set; }
  public Guid FuncionarioId { get; set; }
  public DateTime DataHora { get; set; }
  public string? Hora { get; set; }
  public string Local { get; set; }
  public string Motivo { get; set; }
  public decimal Valor { get; set; }
}

