using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.EpocaService.DTOs;

namespace GACloud.API.Application.Services.Base.RubricaService.DTOs
{
  public class RubricaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Codigo { get; set; }
    public Guid EpocaId { get; set; }
    public EpocaDTO? Epoca { get; set; }
    public string? Descricao { get; set; }
    public string? ClassificacaoTipo { get; set; }
    public int RubricaTipo { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
