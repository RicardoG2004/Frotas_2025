using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CategoriaService.DTOs
{
  public class DeleteMultipleCategoriaRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
