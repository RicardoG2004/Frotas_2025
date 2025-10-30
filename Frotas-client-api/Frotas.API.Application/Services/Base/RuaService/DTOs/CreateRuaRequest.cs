using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.RuaService.DTOs
{
  public class CreateRuaRequest : IDto
  {
    public required string Nome { get; set; }
    public required string FreguesiaId { get; set; }
    public required string CodigoPostalId { get; set; }
  }

  public class CreateRuaValidator : AbstractValidator<CreateRuaRequest>
  {
    public CreateRuaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.FreguesiaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("FreguesiaId deve ser uma GUID válida e não estar vazia");
      _ = RuleFor(x => x.CodigoPostalId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("CodigoPostalId deve ser uma GUID válida e não estar vazio");
    }
  }
}
