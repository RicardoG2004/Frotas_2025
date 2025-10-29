using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.SepulturaService.DTOs
{
  public class CreateProprietarioFromSepulturaRequest : IDto
  {
    // If ProprietarioId is provided, use existing proprietario
    public Guid? ProprietarioId { get; set; }

    // If ProprietarioId is null, create new proprietario with these details
    public Guid? CemiterioId { get; set; }
    public Guid? EntidadeId { get; set; }

    // Relationship-specific data
    public required DateTime Data { get; set; }
    public required bool Ativo { get; set; }
    public required bool IsProprietario { get; set; }
    public required bool IsResponsavel { get; set; }
    public required bool IsResponsavelGuiaReceita { get; set; }
    public DateTime? DataInativacao { get; set; }
    public string? Fracao { get; set; }
    public required bool Historico { get; set; }
    public string? Observacoes { get; set; }
  }

  public class CreateProprietarioFromSepulturaValidator
    : AbstractValidator<CreateProprietarioFromSepulturaRequest>
  {
    public CreateProprietarioFromSepulturaValidator()
    {
      _ = RuleFor(x => x.Data).NotEmpty();

      // Either ProprietarioId must be provided, or all proprietario creation fields must be provided
      _ = RuleFor(x => x)
        .Must(x => x.ProprietarioId.HasValue || (x.CemiterioId.HasValue && x.EntidadeId.HasValue))
        .WithMessage(
          "Either provide an existing ProprietarioId or CemiterioId and EntidadeId to create a new proprietario"
        );
    }
  }
}

