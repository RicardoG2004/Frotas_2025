using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.DTOs
{
  public class CreateAgenciaFunerariaRequest : IDto
  {
    public required string EntidadeId { get; set; }
    public required bool Historico { get; set; }
  }

  public class CreateAgenciaFunerariaValidator
    : AbstractValidator<CreateAgenciaFunerariaRequest>
  {
    public CreateAgenciaFunerariaValidator()
    {
      _ = RuleFor(x => x.EntidadeId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("EntidadeId deve ser uma GUID válida e não estar vazia");
    }
  }
}

