using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.EpocaService.DTOs
{
  public class CreateEpocaRequest : IDto
  {
    public required string Ano { get; set; }
    public required string Descricao { get; set; }
    public required bool Predefinida { get; set; }
    public required bool Bloqueada { get; set; }
    public string? EpocaAnteriorId { get; set; }
  }

  public class CreateEpocaValidator : AbstractValidator<CreateEpocaRequest>
  {
    public CreateEpocaValidator()
    {
      _ = RuleFor(x => x.Ano).NotEmpty();
      _ = RuleFor(x => x.Descricao).NotEmpty();
      _ = RuleFor(x => x.EpocaAnteriorId)
        .Must(x => x == null || string.IsNullOrEmpty(x) || GSHelpers.BeValidGuid(x))
        .WithMessage("Quando fornecido, EpocaAnteriorId deve ser uma GUID válida");
    }
  }
}
