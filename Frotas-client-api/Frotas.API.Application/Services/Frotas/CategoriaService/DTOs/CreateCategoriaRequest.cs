using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.CategoriaService.DTOs
{
  public class CreateCategoriaRequest : IDto
  {
    public required string Designacao { get; set; }
  }

  public class CreateCategoriaValidator : AbstractValidator<CreateCategoriaRequest>
  {
    public CreateCategoriaValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}
