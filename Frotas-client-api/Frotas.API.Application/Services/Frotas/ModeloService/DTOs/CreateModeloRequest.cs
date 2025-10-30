using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.ModeloService.DTOs
{
  public class CreateModeloRequest : IDto
  {
    public required string Nome { get; set; }
    public required Guid MarcaId { get; set; }
  }

  public class CreateModeloValidator : AbstractValidator<CreateModeloRequest>
  {
    public CreateModeloValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.MarcaId).NotEmpty();
    }
  }
}
