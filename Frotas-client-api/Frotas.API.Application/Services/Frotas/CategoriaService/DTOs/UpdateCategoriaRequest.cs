using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.CategoriaService.DTOs
{
  public class UpdateCategoriaRequest : IDto
  {
    public required string Designacao { get; set; }
  }

  public class UpdateCategoriaValidator : AbstractValidator<UpdateCategoriaRequest>
  {
    public UpdateCategoriaValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}
