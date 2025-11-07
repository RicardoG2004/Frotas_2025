using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs
{
  public class TipoViaturaDTO : IDto
  {
    public Guid Id { get; set; }
    public string Designacao { get; set; }
  }
}