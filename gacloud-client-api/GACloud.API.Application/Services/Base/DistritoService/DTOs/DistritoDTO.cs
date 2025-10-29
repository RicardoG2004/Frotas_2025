using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.PaisService.DTOs;

namespace GACloud.API.Application.Services.Base.DistritoService.DTOs
{
  public class DistritoDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid? PaisId { get; set; }
    public PaisDTO? Pais { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
