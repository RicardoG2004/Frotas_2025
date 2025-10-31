using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CombustivelService.DTOs
{
  public class CombustivelDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Nome { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
