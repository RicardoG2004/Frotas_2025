namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.DTOs
{
  public class DeleteMultipleAbastecimentoRequest
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }
}

