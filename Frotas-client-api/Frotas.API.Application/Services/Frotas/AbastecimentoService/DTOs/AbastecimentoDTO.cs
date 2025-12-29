using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;

namespace Frotas.API.Application.Services.Frotas.AbastecimentoService.DTOs
{
  public class AbastecimentoDTO : IDto
  {
    public Guid Id { get; set; }
    public DateTime Data { get; set; }
    public Guid FuncionarioId { get; set; }
    public FuncionarioDTO? Funcionario { get; set; }
    public Guid ViaturaId { get; set; }
    public ViaturaDTO? Viatura { get; set; }
    public decimal? Kms { get; set; }
    public decimal? Litros { get; set; }
    public decimal? Valor { get; set; }
    public DateTime CreatedOn { get; set; }
  }
}

