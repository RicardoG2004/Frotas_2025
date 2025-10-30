using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class MarcaDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Nome { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
