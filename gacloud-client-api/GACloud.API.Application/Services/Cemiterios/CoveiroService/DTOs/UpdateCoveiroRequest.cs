using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Cemiterios.CoveiroService.DTOs
{
  public class UpdateCoveiroRequest : IDto
  {
    public required string Nome { get; set; }
    public required string RuaId { get; set; }
    public required string CodigoPostalId { get; set; }
    public required bool Historico { get; set; }
  }

  public class UpdateCoveiroValidator : AbstractValidator<UpdateCoveiroRequest>
  {
    public UpdateCoveiroValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.RuaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("RuaId deve ser uma GUID válida e não estar vazia");
      _ = RuleFor(x => x.CodigoPostalId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("CodigoPostalId deve ser uma GUID válida e não estar vazia");
    }
  }
}
