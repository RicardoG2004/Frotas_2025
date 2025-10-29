using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.EntidadeContactoService.DTOs
{
  public class EntidadeContactoDTO : IDto
  {
    public Guid Id { get; set; }
    public int EntidadeContactoTipoId { get; set; }
    public Guid EntidadeId { get; set; }
    public string? Valor { get; set; }
    public bool Principal { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
