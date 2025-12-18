using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.UtilizacaoService.DTOs
{
  public class DeleteMultipleUtilizacaoRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }
}

