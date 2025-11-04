using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.EquipamentoService.DTOs
{
  public class UpdateEquipamentoRequest : IDto
  {
    public required string Designacao { get; set; }
    public required string Garantia { get; set; }
    public string Obs { get; set; }
  }

  public class UpdateEquipamentoValidator : AbstractValidator<UpdateEquipamentoRequest>
  {
    public UpdateEquipamentoValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
      _ = RuleFor(x => x.Garantia).NotEmpty();
    }
  }
}