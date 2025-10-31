using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.CombustivelService.DTOs
{
  public class CreateCombustivelRequest : IDto
  {
    public required string Nome { get; set; }
  }

  public class CreateCombustivelValidator : AbstractValidator<CreateCombustivelRequest>
  {
    public CreateCombustivelValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
    }
  }
}
