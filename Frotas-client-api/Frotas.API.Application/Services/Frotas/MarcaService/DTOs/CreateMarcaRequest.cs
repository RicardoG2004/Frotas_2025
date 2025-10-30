using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class CreateMarcaRequest : IDto
  {
    public required string Nome { get; set; }
  }

  public class CreateMarcaValidator : AbstractValidator<CreateMarcaRequest>
  {
    public CreateMarcaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
    }
  }
}
