using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.SetorService.DTOs
{
  public class UpdateSetorRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class UpdateSetorValidator : AbstractValidator<UpdateSetorRequest>
  {
    public UpdateSetorValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}