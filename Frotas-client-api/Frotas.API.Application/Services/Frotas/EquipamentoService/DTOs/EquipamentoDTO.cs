using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs
{
  public class EquipamentoDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Designacao { get; set; }
    public string? Garantia { get; set; }
    public string? Obs { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}