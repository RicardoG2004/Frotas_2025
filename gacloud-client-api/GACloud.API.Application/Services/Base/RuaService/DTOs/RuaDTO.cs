using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.CodigoPostalService.DTOs;
using GACloud.API.Application.Services.Base.FreguesiaService.DTOs;

namespace GACloud.API.Application.Services.Base.RuaService.DTOs
{
  public class RuaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid FreguesiaId { get; set; }
    public FreguesiaDTO? Freguesia { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostalDTO? CodigoPostal { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
