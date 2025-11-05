using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.CodigoPostalService.DTOs;
using Frotas.API.Application.Services.Base.FreguesiaService.DTOs;
using Frotas.API.Application.Services.Base.ConcelhoService.DTOs;

namespace Frotas.API.Application.Services.Base.ConservatoriaService.DTOs
{
  public class ConservatoriaDTO : IDto
  {
    public Guid Id { get; set; }
    public string Nome { get; set; }
    public string Morada { get; set; }
    public Guid CodigoPostalId { get; set; }
    public CodigoPostalDTO CodigoPostal { get; set; }
    public Guid FreguesiaId { get; set; }
    public FreguesiaDTO Freguesia { get; set; }
    public Guid ConcelhoId { get; set; }
    public ConcelhoDTO Concelho { get; set; }
    public string Telefone { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}
