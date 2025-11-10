using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs
{
  public class CreateSeguradoraRequest : IDto
  {
    public required string Descricao { get; set; }
  }

  public class CreateSeguradoraValidator : AbstractValidator<CreateSeguradoraRequest>
  {
    public CreateSeguradoraValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}