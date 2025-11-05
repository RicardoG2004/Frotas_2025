using FluentValidation;
using Frotas.API.Application.Common.Marker;
using Frotas.API.Application.Utility;

namespace Frotas.API.Application.Services.Base.ConservatoriaService.DTOs
{
  public class UpdateConservatoriaRequest : IDto
  {
    public required string Nome { get; set; }
    public required string Morada { get; set; }
    public required Guid CodigoPostalId { get; set; }
    public required Guid FreguesiaId { get; set; }
    public required Guid ConcelhoId { get; set; }
    public required string Telefone { get; set; }
  }

  public class UpdateConservatoriaValidator : AbstractValidator<UpdateConservatoriaRequest>
  {
    public UpdateConservatoriaValidator()
    {
      _ = RuleFor(x => x.Nome).NotEmpty();
      _ = RuleFor(x => x.Morada).NotEmpty();
      _ = RuleFor(x => x.CodigoPostalId).NotEmpty();
      _ = RuleFor(x => x.FreguesiaId).NotEmpty();
      _ = RuleFor(x => x.ConcelhoId).NotEmpty();
      _ = RuleFor(x => x.Telefone).NotEmpty();
    }
  }
}