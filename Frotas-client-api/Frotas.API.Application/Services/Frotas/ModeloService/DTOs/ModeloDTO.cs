using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Frotas.MarcaService.DTOs;

namespace Frotas.API.Application.Services.Frotas.ModeloService.DTOs
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
