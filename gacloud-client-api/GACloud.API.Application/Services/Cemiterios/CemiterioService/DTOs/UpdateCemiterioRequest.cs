using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Cemiterios.CemiterioService.DTOs
{
  public class UpdateCemiterioRequest : IDto
  {
    public required string Nome { get; set; }
    public required string Morada { get; set; }
    public required string CodigoPostalId { get; set; }
    public required bool Predefinido { get; set; }
  }

  public class UpdateCemiterioValidator : AbstractValidator<UpdateCemiterioRequest>
  {
    public UpdateCemiterioValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.Morada).NotEmpty();
      _ = RuleFor(x => x.CodigoPostalId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("CodigoPostalId deve ser uma GUID válida e não estar vazia");
    }
  }
}

