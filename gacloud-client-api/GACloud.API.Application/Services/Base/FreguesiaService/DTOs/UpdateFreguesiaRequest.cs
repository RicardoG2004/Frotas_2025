using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Base.FreguesiaService.DTOs
{
  public class UpdateFreguesiaRequest : IDto
  {
    public required string Nome { get; set; }
    public required string ConcelhoId { get; set; }
  }

  public class UpdateFreguesiaValidator : AbstractValidator<UpdateFreguesiaRequest>
  {
    public UpdateFreguesiaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.ConcelhoId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("ConcelhoId deve ser uma GUID válida e não estar vazia");
    }
  }
}
