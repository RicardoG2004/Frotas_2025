using FluentValidation;
using Frotas.API.Application.Common.Marker;

namespace Frotas.API.Application.Services.Frotas.SeguradoraService.DTOs
{
  public class DeleteMultipleSeguradoraRequest : IDto
  {
    public required IEnumerable<Guid> Ids { get; set; }
  }
  public class DeleteMultipleSeguradoraValidator : AbstractValidator<DeleteMultipleSeguradoraRequest>
  {
    public DeleteMultipleSeguradoraValidator()
    {
      _ = RuleFor(x => x.Ids).NotEmpty();
    }
  }
}
