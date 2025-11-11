using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.EntidadeService.DTOs
{
  public class DeleteMultipleEntidadeRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }
  
}
