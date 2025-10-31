using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CombustivelService.DTOs
{
  public class DeleteMultipleCombustivelRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }
}
