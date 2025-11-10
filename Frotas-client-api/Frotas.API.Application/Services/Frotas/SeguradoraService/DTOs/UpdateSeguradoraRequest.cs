using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs
{
  public class UpdateSeguradoraRequest : IDto
  {
    public required string Descricao { get; set; }
  }
  public class UpdateSeguradoraValidator : AbstractValidator<UpdateSeguradoraRequest>
  {
    public UpdateSeguradoraValidator()
    {
      _ = RuleFor(x => x.Descricao).NotEmpty();
    }
  }
}