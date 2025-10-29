using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Cemiterios.ZonaService.DTOs
{
  public class CreateZonaRequest : IDto
  {
    public required string Nome { get; set; }
    public required string CemiterioId { get; set; }
  }

  public class CreateZonaValidator : AbstractValidator<CreateZonaRequest>
  {
    public CreateZonaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.CemiterioId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("CemiterioId deve ser uma GUID válida e não estar vazia");
    }
  }
}

