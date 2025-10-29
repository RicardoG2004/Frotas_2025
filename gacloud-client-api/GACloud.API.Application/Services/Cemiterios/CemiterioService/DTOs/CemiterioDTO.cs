using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.CodigoPostalService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs
{
  public class CemiterioDTO : IDto
  {
    public Guid Id { get; set; }
    public string? Nome { get; set; }
    public string? Morada { get; set; }
    public Guid? CodigoPostalId { get; set; }
    public CodigoPostalDTO? CodigoPostal { get; set; }
    public DateTime CreatedOn { get; set; }
    public bool Predefinido { get; set; }
  }
}

