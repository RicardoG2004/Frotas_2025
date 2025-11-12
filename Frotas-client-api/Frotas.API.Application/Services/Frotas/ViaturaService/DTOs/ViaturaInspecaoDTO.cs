using System;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;

public class ViaturaInspecaoDTO : IDto
{
  public Guid Id { get; set; }
  public DateTime DataInspecao { get; set; }
  public string Resultado { get; set; }
  public DateTime DataProximaInspecao { get; set; }
}

public class ViaturaInspecaoUpsertDTO : IDto
{
  public Guid? Id { get; set; }
  public DateTime DataInspecao { get; set; }
  public string Resultado { get; set; }
  public DateTime DataProximaInspecao { get; set; }
}


