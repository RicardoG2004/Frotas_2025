using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.DistritoService.DTOs;

namespace Frotas.API.Application.Services.Base.ConcelhoService.DTOs
{
  public class ConcelhoDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid? DistritoId { get; set; }
    public DistritoDTO? Distrito { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
