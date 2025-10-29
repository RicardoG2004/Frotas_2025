using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Base.ConcelhoService.DTOs
{
  public class UpdateConcelhoRequest : IDto
  {
    public required string Nome { get; set; }
    public required string DistritoId { get; set; }
  }

  public class UpdateConcelhoValidator : AbstractValidator<UpdateConcelhoRequest>
  {
    public UpdateConcelhoValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.DistritoId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("DistritoId deve ser uma GUID válida e não estar vazia");
    }
  }
}
