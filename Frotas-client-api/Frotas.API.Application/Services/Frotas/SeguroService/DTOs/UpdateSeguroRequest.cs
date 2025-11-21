using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.SeguroService.DTOs
{
  public class UpdateSeguroRequest : IDto
  {
    public required string Designacao { get; set; }
    public required string Apolice { get; set; }
    public required Guid SeguradoraId { get; set; }
    public required bool AssistenciaViagem { get; set; }
    public required bool CartaVerde { get; set; }
    public required decimal ValorCobertura { get; set; }
    public required decimal CustoAnual { get; set; }
    public required string RiscosCobertos { get; set; }
    public required DateTime DataInicial { get; set; }
    public required DateTime DataFinal { get; set; }
    public required PeriodicidadeSeguro Periodicidade { get; set; }
    public MetodoPagamentoSeguro? MetodoPagamento { get; set; }
    public DateTime? DataPagamento { get; set; }
    public string? Documentos { get; set; }
  }

  public class UpdateSeguroValidator : AbstractValidator<UpdateSeguroRequest>
  {
    public UpdateSeguroValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
      _ = RuleFor(x => x.Apolice).NotEmpty();
      _ = RuleFor(x => x.SeguradoraId).NotEmpty();
      // AssistenciaViagem e CartaVerde podem ser false, não precisam de validação
      _ = RuleFor(x => x.ValorCobertura).NotEmpty();
      _ = RuleFor(x => x.CustoAnual).NotEmpty();
      _ = RuleFor(x => x.RiscosCobertos).NotEmpty();
      _ = RuleFor(x => x.DataInicial).NotEmpty();
      _ = RuleFor(x => x.DataFinal).NotEmpty();
    }
  }
}
