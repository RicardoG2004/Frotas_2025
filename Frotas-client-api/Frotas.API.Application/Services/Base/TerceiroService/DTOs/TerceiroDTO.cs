using System;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;

namespace Frotas.API.Application.Services.Base.TerceiroService.DTOs
{
  public class TerceiroDTO : IDto
  {
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public string NIF { get; set; }
    public string Morada { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostalDTO CodigoPostal { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}