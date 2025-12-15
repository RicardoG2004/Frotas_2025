using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;

namespace Frotas.API.Application.Services.Frotas.ReservaOficinaService.DTOs
{
  public class ReservaOficinaDTO : IDto
  {
    public Guid Id { get; set; }
    public DateTime DataReserva { get; set; }
    public Guid FuncionarioId { get; set; }
    public FuncionarioDTO? Funcionario { get; set; }
    public Guid? ViaturaId { get; set; }
    public ViaturaDTO? Viatura { get; set; }
    public string? HoraInicio { get; set; }
    public string? HoraFim { get; set; }
    public string? Causa { get; set; }
    public string? Observacoes { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

