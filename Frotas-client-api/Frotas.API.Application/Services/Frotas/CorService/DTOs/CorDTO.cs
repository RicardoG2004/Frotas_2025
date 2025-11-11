using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CorService.DTOs
{
  public class CorDTO : IDto
  {
    public Guid Id { get; set; }
    public string Designacao { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}


