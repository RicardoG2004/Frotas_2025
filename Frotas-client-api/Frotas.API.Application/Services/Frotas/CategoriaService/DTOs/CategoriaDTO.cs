using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CategoriaService.DTOs
{
  public class CategoriaDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Designacao { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
