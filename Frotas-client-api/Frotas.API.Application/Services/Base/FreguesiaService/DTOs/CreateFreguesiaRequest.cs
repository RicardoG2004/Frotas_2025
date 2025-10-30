using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.FreguesiaService.DTOs
{
  public class CreateFreguesiaRequest : IDto
  {
    public required string Nome { get; set; }
    public required string ConcelhoId { get; set; }
  }

  public class CreateFreguesiaValidator : AbstractValidator<CreateFreguesiaRequest>
  {
    public CreateFreguesiaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.ConcelhoId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("ConcelhoId deve ser uma GUID válida e não estar vazia");
    }
  }
}
