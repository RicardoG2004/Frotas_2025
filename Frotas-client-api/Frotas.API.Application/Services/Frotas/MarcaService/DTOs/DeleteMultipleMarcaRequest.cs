using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class DeleteMultipleMarcaRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
