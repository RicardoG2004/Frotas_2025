using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Services.Base.EntidadeService.DTOs;
using GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs;

namespace GACloud.API.Application.Services.Cemiterios.ProprietarioService.DTOs
{
  public class ProprietarioDTO : IDto
  {
    public Guid Id { get; set; }
    public Guid CemiterioId { get; set; }
    public CemiterioDTO? Cemiterio { get; set; }
    public Guid EntidadeId { get; set; }
    public EntidadeDTO? Entidade { get; set; }
    public DateTime CreatedOn { get; set; }
    public List<ProprietarioSepulturaDTO>? Sepulturas { get; set; }
  }
}

