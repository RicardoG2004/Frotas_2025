using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.PecaService.DTOs
{
  public class CreatePecaRequest : IDto
  {
    public required string Designacao { get; set; }
    public required int Anos { get; set; }
    public required int Kms { get; set; }
    public required string Tipo { get; set; }
    public Guid? TaxaIvaId { get; set; }
    public required decimal Custo { get; set; }
  }

  public class CreatePecaValidator : AbstractValidator<CreatePecaRequest>
  {
    public CreatePecaValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}
