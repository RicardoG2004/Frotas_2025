using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.SetorService.DTOs
{
  public class SetorDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Descricao { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}