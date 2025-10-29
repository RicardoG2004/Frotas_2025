using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Cemiterios.DefuntoTipoService.DTOs
{
  public class CreateDefuntoTipoRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class CreateDefuntoTipoValidator
    : AbstractValidator<CreateDefuntoTipoRequest>
  {
    public CreateDefuntoTipoValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}

