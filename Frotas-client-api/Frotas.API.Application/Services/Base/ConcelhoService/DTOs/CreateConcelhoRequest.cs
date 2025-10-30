using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.ConcelhoService.DTOs
{
  public class CreateConcelhoRequest : IDto
  {
    public required string Nome { get; set; }
    public required string DistritoId { get; set; }
  }

  public class CreateConcelhoValidator : AbstractValidator<CreateConcelhoRequest>
  {
    public CreateConcelhoValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.DistritoId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("DistritoId deve ser uma GUID válida e não estar vazia");
    }
  }
}
