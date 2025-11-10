using Frotas.API.Application.Common.Marker;


namespace Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs
{
  public class SeguradoraDTO : IDto
  {
    public Guid Id { get; set; }
    public string Descricao { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}