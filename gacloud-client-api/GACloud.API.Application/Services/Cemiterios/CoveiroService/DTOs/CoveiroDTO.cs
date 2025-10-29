using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.CodigoPostalService.DTOs;
using GACloud.API.Application.Services.Base.RuaService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService.DTOs
{
  public class CoveiroDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Nome { get; set; }
    public required string RuaId { get; set; }
    public RuaDTO? Rua { get; set; }
    public required string CodigoPostalId { get; set; }
    public CodigoPostalDTO? CodigoPostal { get; set; }
    public bool Historico { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
