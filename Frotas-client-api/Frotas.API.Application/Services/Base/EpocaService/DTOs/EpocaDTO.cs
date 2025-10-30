using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.EpocaService.DTOs
{
  public class EpocaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Ano { get; set; }
    public string? Descricao { get; set; }
    public bool Predefinida { get; set; }
    public bool Bloqueada { get; set; }
    public Guid? EpocaAnteriorId { get; set; }
    public EpocaDTO? EpocaAnterior { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
