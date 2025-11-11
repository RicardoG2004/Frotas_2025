using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.CorService.DTOs
{
  public class UpdateCorRequest : IDto
  {
    public required string Designacao { get; set; }
  }

  public class UpdateCorValidator : AbstractValidator<UpdateCorRequest>
  {
    public UpdateCorValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}


