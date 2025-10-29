using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Base.EpocaService.DTOs
{
  public class UpdateEpocaRequest : IDto
  {
    public required string Ano { get; set; }
    public required string Descricao { get; set; }
    public required bool Predefinida { get; set; }
    public required bool Bloqueada { get; set; }
    public string? EpocaAnteriorId { get; set; }
  }

  public class UpdateEpocaValidator : AbstractValidator<UpdateEpocaRequest>
  {
    public UpdateEpocaValidator()
    {
      _ = RuleFor(x => x.Ano).NotEmpty();
      _ = RuleFor(x => x.Descricao).NotEmpty();
      _ = RuleFor(x => x.EpocaAnteriorId)
        .Must(x => string.IsNullOrEmpty(x) || GSHelpers.BeValidGuid(x))
        .WithMessage("Quando fornecido, EpocaAnteriorId deve ser uma GUID válida");
    }
  }
}
