using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.MarcaService.DTOs
{
  public class UpdateMarcaRequest : IDto
  {
    public required string Nome { get; set; }
  }

  public class UpdateMarcaValidator : AbstractValidator<UpdateMarcaRequest>
  {
    public UpdateMarcaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
    }
  }
}
