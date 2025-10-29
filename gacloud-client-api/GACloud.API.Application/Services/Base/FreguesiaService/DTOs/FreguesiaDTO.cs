using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.ConcelhoService.DTOs;

namespace GACloud.API.Application.Services.Base.FreguesiaService.DTOs
{
  public class FreguesiaDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public Guid? ConcelhoId { get; set; }
    public ConcelhoDTO? Concelho { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
