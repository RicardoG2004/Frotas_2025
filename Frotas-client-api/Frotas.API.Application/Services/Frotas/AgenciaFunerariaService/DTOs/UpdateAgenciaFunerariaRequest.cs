using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.AgenciaFunerariaService.DTOs
{
  public class UpdateAgenciaFunerariaRequest : IDto
  {
    public required string EntidadeId { get; set; }
    public required bool Historico { get; set; }
  }

  public class UpdateAgenciaFunerariaValidator
    : AbstractValidator<UpdateAgenciaFunerariaRequest>
  {
    public UpdateAgenciaFunerariaValidator()
    {
      _ = RuleFor(x => x.EntidadeId)
        .NotEmpty()
        .Must(GSHelpers.BeValidGuid)
        .WithMessage("EntidadeId deve ser uma GUID válida e não estar vazia");
    }
  }
}

