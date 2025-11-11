using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.PaisService.DTOs;

namespace Frotas.API.Application.Services.Base.EntidadeService.DTOs
{
  public class EntidadeDTO : IDto
  {
    public Guid Id { get; set; }
    public required string Designacao { get; set; }
    public required string Morada { get; set; }
    public required string Localidade { get; set; }
    public required Guid CodigoPostalId { get; set; }
    public CodigoPostalDTO CodigoPostal { get; set; }
    public required Guid PaisId { get; set; }
    public PaisDTO Pais { get; set; }
    public required string Telefone { get; set; }
    public required string Fax { get; set; }
    public required string EnderecoHttp { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}