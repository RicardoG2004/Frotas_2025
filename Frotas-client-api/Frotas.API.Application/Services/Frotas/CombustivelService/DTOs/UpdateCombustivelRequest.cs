using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.CombustivelService.DTOs
{
  public class UpdateCombustivelRequest : IDto
  {
    public required string Nome { get; set; }
  }

  public class UpdateCombustivelValidator : AbstractValidator<UpdateCombustivelRequest>
  {
    public UpdateCombustivelValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
    }
  }
}
