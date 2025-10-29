using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Cemiterios.AgenciaFunerariaService.DTOs
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

