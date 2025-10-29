using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Frotas.ModeloService.DTOs
{
  public class ModeloDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Nome { get; set; }
    public required Guid MarcaId { get; set; }
    public MarcaDTO? Marca { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
