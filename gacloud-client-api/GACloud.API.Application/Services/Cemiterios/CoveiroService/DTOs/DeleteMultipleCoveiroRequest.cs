using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService.DTOs
{
  public class DeleteMultipleCoveiroRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
