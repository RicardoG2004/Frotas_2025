using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Base.DistritoService.DTOs
{
  public class UpdateDistritoRequest : IDto
  {
    public required string Nome { get; set; }
    public required string PaisId { get; set; }
  }

  public class UpdateDistritoValidator : AbstractValidator<UpdateDistritoRequest>
  {
    public UpdateDistritoValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.PaisId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("PaisId deve ser uma GUID válida e não estar vazia");
    }
  }
}
