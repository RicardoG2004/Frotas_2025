using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs
{
  public class CreateEquipamentoRequest : IDto
  {
    public required string Designacao { get; set; }
    public required string Garantia { get; set; }
    public string Obs { get; set; }
  }

  public class CreateEquipamentoValidator : AbstractValidator<CreateEquipamentoRequest>
  {
    public CreateEquipamentoValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
      _ = RuleFor(x => x.Garantia).NotEmpty();
    }
  }
}