using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs
{
  public class TalhaoDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid? ZonaId { get; set; }
    public ZonaDTO? Zona { get; set; }
    public bool TemSvgShape { get; set; }
    public string? ShapeId { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

