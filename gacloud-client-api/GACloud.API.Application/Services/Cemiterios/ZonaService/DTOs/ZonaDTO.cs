using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs
{
  public class ZonaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid? CemiterioId { get; set; }
    public CemiterioDTO? Cemiterio { get; set; }
    public bool TemSvgShape { get; set; }
    public string? ShapeId { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

