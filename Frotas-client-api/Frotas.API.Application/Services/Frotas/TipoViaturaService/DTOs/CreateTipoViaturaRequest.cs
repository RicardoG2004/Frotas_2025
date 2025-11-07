using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs
{
  public class CreateTipoViaturaRequest : IDto
  {
    public required string Designacao { get; set; }
  }

  public class CreateTipoViaturaValidator : AbstractValidator<CreateTipoViaturaRequest>
  {
    public CreateTipoViaturaValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}