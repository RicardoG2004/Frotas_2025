using System;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;

public class ViaturaAcidenteDTO : IDto
{
  public Guid Id { get; set; }
  public Guid FuncionarioId { get; set; }
  public DateTime DataHora { get; set; }
  public string? Hora { get; set; }
  public bool Culpa { get; set; }
  public string? DescricaoAcidente { get; set; }
  public string? DescricaoDanos { get; set; }
  public string Local { get; set; }
  public Guid? ConcelhoId { get; set; }
  public Guid? FreguesiaId { get; set; }
  public Guid? CodigoPostalId { get; set; }
  public string? LocalReparacao { get; set; }
}

public class ViaturaAcidenteUpsertDTO : IDto
{
  public Guid? Id { get; set; }
  public Guid FuncionarioId { get; set; }
  public DateTime DataHora { get; set; }
  public string? Hora { get; set; }
  public bool Culpa { get; set; }
  public string? DescricaoAcidente { get; set; }
  public string? DescricaoDanos { get; set; }
  public string Local { get; set; }
  public Guid? ConcelhoId { get; set; }
  public Guid? FreguesiaId { get; set; }
  public Guid? CodigoPostalId { get; set; }
  public string? LocalReparacao { get; set; }
}

