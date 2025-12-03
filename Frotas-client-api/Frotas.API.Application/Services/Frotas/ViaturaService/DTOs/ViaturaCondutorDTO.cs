using System;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ViaturaService.DTOs
{
  public class ViaturaCondutorDTO : IDto
  {
    public Guid FuncionarioId { get; set; }
    public string? Nome { get; set; }
    public string? Documentos { get; set; }
  }

  public class ViaturaCondutorUpsertDTO : IDto
  {
    public Guid FuncionarioId { get; set; }
    public string? Documentos { get; set; }
  }
}

