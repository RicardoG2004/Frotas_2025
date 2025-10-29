using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class DeleteMultipleMarcaRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
