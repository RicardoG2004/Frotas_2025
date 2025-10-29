using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.DTOs
{
  public class UpdateDefuntoTipoRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class UpdateDefuntoTipoValidator
    : AbstractValidator<UpdateDefuntoTipoRequest>
  {
    public UpdateDefuntoTipoValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}

