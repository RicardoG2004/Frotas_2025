using FluentValidation;
using Frotas.API.Application.Common.Marker;
using System.Collections.Generic;

namespace Frotas.API.Application.Services.Frotas.ManutencaoService.DTOs
{
  public class CreateManutencaoRequest : IDto
  {
    public required DateTime DataRequisicao { get; set; }
    public required Guid FseId { get; set; }
    public required Guid FuncionarioId { get; set; }
    public required DateTime DataEntrada { get; set; }
    public required string HoraEntrada { get; set; }
    public required DateTime DataSaida { get; set; }
    public required string HoraSaida { get; set; }
    public required Guid ViaturaId { get; set; }
    public required int KmsRegistados { get; set; }
    public required decimal TotalSemIva { get; set; }
    public required decimal ValorIva { get; set; }
    public required decimal Total { get; set; }
    public ICollection<CreateManutencaoServicoRequest>? Servicos { get; set; }
    public ICollection<CreateManutencaoPecaRequest>? Pecas { get; set; }
  }

  public class CreateManutencaoValidator : AbstractValidator<CreateManutencaoRequest>
  {
    public CreateManutencaoValidator()
    {
      _ = RuleFor(x => x.FseId).NotEmpty();
      _ = RuleFor(x => x.FuncionarioId).NotEmpty();
      _ = RuleFor(x => x.ViaturaId).NotEmpty();
      _ = RuleFor(x => x.HoraEntrada).NotEmpty();
      _ = RuleFor(x => x.HoraSaida).NotEmpty();
      _ = RuleFor(x => x.KmsRegistados).GreaterThanOrEqualTo(0);
    }
  }
}

