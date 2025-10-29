using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class MarcaDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Nome { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
