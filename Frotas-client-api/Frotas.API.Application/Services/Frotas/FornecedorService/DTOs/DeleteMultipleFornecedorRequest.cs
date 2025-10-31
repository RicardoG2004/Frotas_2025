using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.FornecedorService.DTOs
{
  public class DeleteMultipleFornecedorRequest : IDto
  {
    public IEnumerable<Guid> Ids { get; set; } = [];
  }
}
