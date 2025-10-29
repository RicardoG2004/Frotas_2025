using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaTipoDescricaoService.DTOs
{
  public class SepulturaTipoDescricaoDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Descricao { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

