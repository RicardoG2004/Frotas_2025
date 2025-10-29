using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Cemiterios.TalhaoService.DTOs
{
  public class UpdateTalhaoRequest : IDto
  {
    public required string Nome { get; set; }
    public required string ZonaId { get; set; }
  }

  public class UpdateTalhaoValidator : AbstractValidator<UpdateTalhaoRequest>
  {
    public UpdateTalhaoValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.ZonaId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("ZonaId deve ser uma GUID válida e não estar vazia");
    }
  }
}

