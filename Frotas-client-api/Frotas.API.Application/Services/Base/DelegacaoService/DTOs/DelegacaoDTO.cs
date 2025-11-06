using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.PaisService.DTOs;

namespace Frotas.API.Application.Services.Base.DelegacaoService.DTOs
{
  public class DelegacaoDTO : IDto
  {
    public Guid Id { get; set; }
    public string Designacao { get; set; }
    public string Morada { get; set; }
    public string Localidade { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostalDTO CodigoPostal { get; set; }
    public Guid PaisId { get; set; }
    public PaisDTO Pais { get; set; }
    public string Telefone { get; set; }
    public string Email { get; set; }
    public string Fax { get; set; }
    public string EnderecoHttp { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}