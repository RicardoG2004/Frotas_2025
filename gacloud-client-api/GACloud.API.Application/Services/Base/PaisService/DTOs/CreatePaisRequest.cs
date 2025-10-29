using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.PaisService.DTOs
{
  public class CreatePaisRequest : IDto
  {
    public required string Codigo { get; set; }
    public required string Nome { get; set; }
    public required string Prefixo { get; set; }
  }

  public class CreatePaisValidator : AbstractValidator<CreatePaisRequest>
  {
    public CreatePaisValidator()
    {
      _ = RuleFor(x => x.Codigo).NotEmpty();
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.Prefixo).NotEmpty();
    }
  }
}
