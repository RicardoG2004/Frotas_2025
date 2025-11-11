using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CorService.DTOs
{
  public class CreateCorRequest : IDto
  {
    public required string Designacao { get; set; }
  }

  public class CreateCorValidator : AbstractValidator<CreateCorRequest>
  {
    public CreateCorValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}


