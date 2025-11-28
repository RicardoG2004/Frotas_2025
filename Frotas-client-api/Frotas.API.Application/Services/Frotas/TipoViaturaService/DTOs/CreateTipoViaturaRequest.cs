using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Domain.Entities.Frotas;

namespace Frotas.API.Application.Services.Frotas.TipoViaturaService.DTOs
{
  public class CreateTipoViaturaRequest : IDto
  {
    public required string Designacao { get; set; }
  }

  public class CreateTipoViaturaValidator : AbstractValidator<CreateTipoViaturaRequest>
  {
    public CreateTipoViaturaValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
      // Validação de CategoriaInspecao removida: não é mais necessária
    }
  }
}