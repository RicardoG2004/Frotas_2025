using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Services.Base.FseService.DTOs;
using Frotas.API.Application.Services.Base.FuncionarioService.DTOs;
using Frotas.API.Application.Services.Frotas.ViaturaService.DTOs;
using Frotas.API.Application.Services.Frotas.ServicoService.DTOs;
using System.Collections.Generic;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.DTOs
{
  public class ManutencaoDTO : IDto
  {
    public Guid Id { get; set; }
    public DateTime DataRequisicao { get; set; }
    public Guid FseId { get; set; }
    public FseDTO? Fse { get; set; }
    public Guid FuncionarioId { get; set; }
    public FuncionarioDTO? Funcionario { get; set; }
    public DateTime DataEntrada { get; set; }
    public string HoraEntrada { get; set; }
    public DateTime DataSaida { get; set; }
    public string HoraSaida { get; set; }
    public Guid ViaturaId { get; set; }
    public ViaturaDTO? Viatura { get; set; }
    public int KmsRegistados { get; set; }
    public decimal TotalSemIva { get; set; }
    public decimal ValorIva { get; set; }
    public decimal Total { get; set; }
    public ICollection<ManutencaoServicoDTO>? ManutencaoServicos { get; set; }
    public DateTime CreatedOn { get; set; }
  }

  public class ManutencaoServicoDTO : IDto
  {
    public Guid Id { get; set; }
    public Guid ManutencaoId { get; set; }
    public Guid ServicoId { get; set; }
    public ServicoDTO? Servico { get; set; }
    public int Quantidade { get; set; }
    public int? KmProxima { get; set; }
    public DateTime? DataProxima { get; set; }
    public decimal ValorSemIva { get; set; }
    public decimal IvaPercentagem { get; set; }
    public decimal ValorTotal { get; set; }
    public DateTime CreatedOn { get; set; }
  }

  public class CreateManutencaoServicoRequest : IDto
  {
    public required Guid ServicoId { get; set; }
    public required int Quantidade { get; set; }
    public int? KmProxima { get; set; }
    public DateTime? DataProxima { get; set; }
    public required decimal ValorSemIva { get; set; }
    public required decimal IvaPercentagem { get; set; }
    public required decimal ValorTotal { get; set; }
  }
}
