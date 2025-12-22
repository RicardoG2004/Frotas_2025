using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.UtilizacaoService.DTOs
{
  public class UpdateUtilizacaoRequest : IDto
  {
    public required DateTime DataUtilizacao { get; set; }
    public DateTime? DataUltimaConferencia { get; set; }
    public required Guid FuncionarioId { get; set; }
    public required Guid ViaturaId { get; set; }
    public string? HoraInicio { get; set; }
    public string? HoraFim { get; set; }
    public string? Causa { get; set; }
    public string? Observacoes { get; set; }
  }

  public class UpdateUtilizacaoValidator : AbstractValidator<UpdateUtilizacaoRequest>
  {
    public UpdateUtilizacaoValidator()
    {
      _ = RuleFor(x => x.FuncionarioId).NotEmpty();
      _ = RuleFor(x => x.ViaturaId).NotEmpty();
      _ = RuleFor(x => x.DataUtilizacao).NotEmpty();
    }
  }
}

