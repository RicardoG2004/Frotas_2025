using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.CodigoPostalService.DTOs
{
  public class CreateCodigoPostalRequest : IDto
  {
    public required string Codigo { get; set; }
    public required string Localidade { get; set; }
  }

  public class CreateCodigoPostalValidator : AbstractValidator<CreateCodigoPostalRequest>
  {
    public CreateCodigoPostalValidator()
    {
      _ = RuleFor(x => x.Codigo).NotEmpty();
      _ = RuleFor(x => x.Localidade).NotEmpty();
    }
  }
}
