using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Frotas.ModeloService.DTOs
{
  public class DeleteMultipleModeloRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
