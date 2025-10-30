using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.PaisService.DTOs
{
  public class PaisDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Codigo { get; set; }
    public required string Nome { get; set; }
    public required string Prefixo { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
