using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Frotas.ServicoService.DTOs
{
  public class UpdateServicoRequest : IDto
  {
    public required string Designacao { get; set; }
    public required int Anos { get; set; }
    public required int Kms { get; set; }
    public required string Tipo { get; set; }
    public Guid? TaxaIvaId { get; set; }
    public required decimal Custo { get; set; }
  }

  public class UpdateServicoValidator
    : AbstractValidator<UpdateServicoRequest>
  {
    public UpdateServicoValidator()
    {
      _ = RuleFor(x => x.Designacao).NotEmpty();
    }
  }
}

