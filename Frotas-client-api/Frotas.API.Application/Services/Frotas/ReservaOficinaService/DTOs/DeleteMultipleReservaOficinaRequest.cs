using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.DTOs
{
  public class DeleteMultipleReservaOficinaRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }
}

