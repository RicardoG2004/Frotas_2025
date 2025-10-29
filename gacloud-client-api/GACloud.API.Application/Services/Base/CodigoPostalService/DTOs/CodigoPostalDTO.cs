using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.CodigoPostalService.DTOs
{
  public class CodigoPostalDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Codigo { get; set; }
    public string? Localidade { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
