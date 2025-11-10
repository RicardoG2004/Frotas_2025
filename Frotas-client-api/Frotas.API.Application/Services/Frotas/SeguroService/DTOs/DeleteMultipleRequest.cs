using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.SeguroService.DTOs
{
  public class DeleteMultipleSeguroRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
