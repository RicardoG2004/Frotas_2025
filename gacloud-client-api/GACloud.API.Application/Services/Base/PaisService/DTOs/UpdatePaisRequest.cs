using FluentValidation;
using GACloud.API.Application.Common.Marker;

namespace GACloud.API.Application.Services.Base.PaisService.DTOs
{
  public class UpdatePaisRequest : IDto
  {
    public required string Codigo { get; set; }
    public required string Nome { get; set; }
    public required string Prefixo { get; set; }
  }

  public class UpdatePaisValidator : AbstractValidator<UpdatePaisRequest>
  {
    public UpdatePaisValidator()
    {
      _ = RuleFor(x => x.Codigo).NotEmpty();
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.Prefixo).NotEmpty();
    }
  }
}
