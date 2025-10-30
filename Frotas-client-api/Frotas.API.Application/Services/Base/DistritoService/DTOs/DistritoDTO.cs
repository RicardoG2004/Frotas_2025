using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.PaisService.DTOs;

namespace Frotas.API.Application.Services.Base.DistritoService.DTOs
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
