using System;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;

public class ViaturaInspecaoDTO : IDto
{
  public Guid Id { get; set; }
  public DateTime DataInspecao { get; set; }
  public string Resultado { get; set; }
  public DateTime DataProximaInspecao { get; set; }
  // Campo para retornar documentos anexados a esta inspeção
  // Porquê: Permite que o frontend exiba e gerencie documentos específicos de cada inspeção
  public string? Documentos { get; set; }
}

public class ViaturaInspecaoUpsertDTO : IDto
{
  public Guid? Id { get; set; }
  public DateTime DataInspecao { get; set; }
  public string Resultado { get; set; }
  public DateTime DataProximaInspecao { get; set; }
  // Campo para enviar documentos anexados a esta inspeção
  // Porquê: Permite que o frontend envie documentos específicos de cada inspeção
  public string? Documentos { get; set; }
}


