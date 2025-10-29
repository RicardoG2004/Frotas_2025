using FluentValidation;
using GACloud.API.Application.Common.Marker;
using GACloud.API.Application.Utility;

namespace GACloud.API.Application.Services.Cemiterios.MarcaService.DTOs
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
