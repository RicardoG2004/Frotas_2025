using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.DistritoService.DTOs;

namespace GACloud.API.Application.Services.Base.ConcelhoService.DTOs
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
