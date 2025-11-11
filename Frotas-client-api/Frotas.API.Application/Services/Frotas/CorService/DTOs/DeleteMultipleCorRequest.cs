using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CorService.DTOs
{
  public class DeleteMultipleCorRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}


