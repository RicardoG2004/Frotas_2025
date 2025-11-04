using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.SetorService.DTOs
{
  public class CreateSetorRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class CreateSetorValidator : AbstractValidator<CreateSetorRequest>
  {
    public CreateSetorValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}