using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.EntidadeService.DTOs;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.DTOs
{
  public class AgenciaFunerariaDTO : IDto
  {
    public Guid Id { get; set; }
    public bool Historico { get; set; }
    public Guid? EntidadeId { get; set; }
    public EntidadeDTO? Entidade { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

