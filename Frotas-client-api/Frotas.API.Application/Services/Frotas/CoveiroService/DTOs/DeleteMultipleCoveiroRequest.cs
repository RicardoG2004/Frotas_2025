using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CoveiroService.DTOs
{
  public class DeleteMultipleCoveiroRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
