using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ModeloService.DTOs
{
  public class DeleteMultipleModeloRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
