using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Base.CodigoPostalService.DTOs
{
  public class UpdateCodigoPostalRequest : IDto
  {
    public required string Codigo { get; set; }
    public required string Localidade { get; set; }
  }

  public class UpdateCodigoPostalValidator : AbstractValidator<UpdateCodigoPostalRequest>
  {
    public UpdateCodigoPostalValidator()
    {
      _ = RuleFor(x => x.Codigo).NotEmpty();
      _ = RuleFor(x => x.Localidade).NotEmpty();
    }
  }
}
